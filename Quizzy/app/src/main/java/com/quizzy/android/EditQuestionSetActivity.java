package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.Adapters.QuestionSetAdapter2;
import com.quizzy.android.Adapters.QuestionsAdapter;
import com.quizzy.android.DataStructures.Answer;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;

import java.util.ArrayList;
import java.util.List;

public class EditQuestionSetActivity extends AppCompatActivity {

    private TextView questionsCountTextView;
    private EditText titleEditText;
    private Spinner visibilitySpinner;
    private Button saveTitleButton;
    private Button addQuestionButton;
    private ListView questionsListView;

    private List<Question> questionList;
    private List<String> questionIds;

    private String visibilityType;

    private DatabaseReference databaseReference;

    private QuestionsAdapter questionsAdapter;

    private String quizAuthor;
    private String quizId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_question_set);

        quizAuthor = getIntent().getStringExtra("quizAuthor");
        quizId = getIntent().getStringExtra("quizId");

        // Get database reference
        databaseReference = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Initialize views
        questionsCountTextView = findViewById(R.id.questionsCountTextView);
        titleEditText = findViewById(R.id.titleEditText);
        visibilitySpinner = findViewById(R.id.visibilitySpinner);
        questionsListView = findViewById(R.id.questionsListView);
        saveTitleButton = findViewById(R.id.saveTitleButton);
        addQuestionButton = findViewById(R.id.addQuestionButton);

        // Initialize question sets IDs
        questionIds = new ArrayList<>();

        // Initialize question sets
        questionList = getQuestions();


        // Initialize spinner
        ArrayAdapter<CharSequence> spinnerAdapter = ArrayAdapter.createFromResource(this,
                R.array.visibility_options, android.R.layout.simple_spinner_item);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        visibilitySpinner.setAdapter(spinnerAdapter);

        // Set the spinner selection to "All question sets"
        boolean initialVisibility = getIntent().getBooleanExtra("visibility", true);
        if(initialVisibility) {
            visibilitySpinner.setSelection(0);
            visibilityType = "Public";
        } else {
            visibilitySpinner.setSelection(1);
            visibilityType = "Private";
        }

        visibilitySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                visibilityType = parent.getItemAtPosition(position).toString();

                // TODO: Change question set visibility in firebase
                // ...
                if (visibilityType.equals("Public")) {
                    databaseReference.child(quizAuthor).child(quizId).child("isPublic").setValue(true);
                } else {
                    databaseReference.child(quizAuthor).child(quizId).child("isPublic").setValue(false);
                }

                Toast.makeText(EditQuestionSetActivity.this, "Visibility set to" + visibilityType, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });

        // Initialize question set adapter
        questionsAdapter = new QuestionsAdapter(this, questionList, questionIds, quizAuthor, quizId);
        questionsListView.setAdapter(questionsAdapter);

        // Notify the adapter after the data is fetched
        questionsAdapter.notifyDataSetChanged();

        // Display question set title
        databaseReference.child(quizAuthor).child(quizId).child("Title").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                String currentTitle = snapshot.getValue(String.class);
                titleEditText.setText(currentTitle);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

        // Set save title button listener
        saveTitleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: Change question set title in firebase
                String newTitle = titleEditText.getText().toString();
                databaseReference.child(quizAuthor).child(quizId).child("Title").setValue(newTitle);
                Toast.makeText(EditQuestionSetActivity.this, "Title changed to " + newTitle, Toast.LENGTH_SHORT).show();
            }
        });

        // Set add question button listener
        addQuestionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: Start AddQuestionActivity
                Intent newIntent = new Intent(EditQuestionSetActivity.this, AddQuestionActivity.class);
                newIntent.putExtra("quizId", quizId);
                startActivity(newIntent);
            }
        });
    }

    private List<Question> getQuestions() {
        // Get questions data from firebase
        List<Question> questions = new ArrayList<>();

        DatabaseReference questionsRef = databaseReference.child(quizAuthor).child(quizId).child("Questions");

        ValueEventListener initialLoadListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    questionsRef.addChildEventListener(new ChildEventListener() {
                        @Override
                        public void onChildAdded(@NonNull DataSnapshot questionSnapshot, @Nullable String previousChildName) {
                            // Retrieve the question data from Firebase
                            System.out.println("Question added");
                            boolean hasImage = questionSnapshot.child("hasImage").getValue(Boolean.class);
                            String image = questionSnapshot.child("image").getValue(String.class);
                            boolean isFlagged = questionSnapshot.child("isFlagged").getValue(Boolean.class);
                            String questionText = questionSnapshot.child("question").getValue(String.class);
                            Answer answer1 = questionSnapshot.child("answer1").getValue(Answer.class);
                            Answer answer2 = questionSnapshot.child("answer2").getValue(Answer.class);
                            Answer answer3 = questionSnapshot.child("answer3").getValue(Answer.class);
                            Answer answer4 = questionSnapshot.child("answer4").getValue(Answer.class);

                            // Add the new question to the list
                            Question question = new Question(answer1, answer2, answer3, answer4, hasImage, image, isFlagged, questionText);
                            questions.add(question);
                            questionIds.add(questionSnapshot.getKey());

                            // Notify the adapter for new question
                            questionsAdapter.notifyDataSetChanged();

                            // Set question count textView
                            questionsCountTextView.setText("Questions (" + questions.size() + ")");
                        }

                        @Override
                        public void onChildChanged(@NonNull DataSnapshot questionSnapshot, @Nullable String previousChildName) {
                            String questionId = questionSnapshot.getKey();
                            System.out.println("Question changed");

                            int index = questionIds.indexOf(questionId);
                            if (index != -1) {
                                // Retrieve the question data from Firebase
                                boolean hasImage = questionSnapshot.child("hasImage").getValue(Boolean.class);
                                String image = questionSnapshot.child("image").getValue(String.class);
                                boolean isFlagged = questionSnapshot.child("isFlagged").getValue(Boolean.class);
                                String questionText = questionSnapshot.child("question").getValue(String.class);
                                Answer answer1 = questionSnapshot.child("answer1").getValue(Answer.class);
                                Answer answer2 = questionSnapshot.child("answer2").getValue(Answer.class);
                                Answer answer3 = questionSnapshot.child("answer3").getValue(Answer.class);
                                Answer answer4 = questionSnapshot.child("answer4").getValue(Answer.class);


                                // Update the existing Question object
                                Question question = questions.get(index);
                                question.setIsFlagged(isFlagged);
                                question.setImage(image);
                                question.setHasImage(hasImage);
                                question.setQuestion(questionText);
                                question.setAnswer1(answer1);
                                question.setAnswer2(answer2);
                                question.setAnswer3(answer3);
                                question.setAnswer4(answer4);



                                // Notify the adapter for new question
                                questionsAdapter.notifyDataSetChanged();

                                // Set question count textView
                                questionsCountTextView.setText("Questions (" + questions.size() + ")");
                            }
                        }

                        @Override
                        public void onChildRemoved(@NonNull DataSnapshot questionSnapshot) {
                            // Handle the removed child (questionId)
                            System.out.println("Question removed");
                            String questionId = questionSnapshot.getKey();
                            int index = questionIds.indexOf(questionId);
                            if (index != -1) {
                                questions.remove(index);
                                questionIds.remove(index);

                                // Notify the adapter for data change
                                questionsAdapter.notifyDataSetChanged();

                                // Set question count textView
                                questionsCountTextView.setText("Questions (" + questions.size() + ")");
                            }
                        }

                        @Override
                        public void onChildMoved(@NonNull DataSnapshot quizSnapshot, @Nullable String previousChildName) {
                            // Handle any changes to the ordering of children, if applicable
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError databaseError) {
                            // Handle any errors that occur
                        }
                    });

            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle any errors that occur
            }
        };

        // Attach listener to firebase
        questionsRef.addListenerForSingleValueEvent(initialLoadListener);


        return questions;
    }
}