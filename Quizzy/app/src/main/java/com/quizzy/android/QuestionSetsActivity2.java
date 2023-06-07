package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.Adapters.QuestionSetAdapter2;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.DataStructures.Answer;

import java.util.ArrayList;
import java.util.List;

public class QuestionSetsActivity2 extends AppCompatActivity {

    private EditText searchEditText;
    private Spinner questionSetSpinner;
    private Button createQuestionSetButton;
    private ListView questionSetsListView;

    private List<QuestionSet> questionSetList;
    private List<QuestionSet> filteredQuestionSetList;
    private List<String> questionSetIds;
    private List<String> filteredQuestionSetIds;

    private String selectedQuestionSetType;

    private DatabaseReference databaseReference;

    private QuestionSetAdapter2 questionSetAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question_sets2);

        // Get database reference
        databaseReference = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Initialize views
        searchEditText = findViewById(R.id.searchEditText);
        questionSetSpinner = findViewById(R.id.questionSetSpinner);
        questionSetsListView = findViewById(R.id.questionSetsListView);
        createQuestionSetButton = findViewById(R.id.createQuestionSetButton);

        // Initialize question sets IDs
        questionSetIds = new ArrayList<>();

        // Initialize question sets
        questionSetList = getQuestionSets();
        filteredQuestionSetList = new ArrayList<>(questionSetList);

        // Initialize question sets IDs
        filteredQuestionSetIds = new ArrayList<>(questionSetIds);

        // Initialize spinner
        ArrayAdapter<CharSequence> spinnerAdapter = ArrayAdapter.createFromResource(this,
                R.array.question_set_types, android.R.layout.simple_spinner_item);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        questionSetSpinner.setAdapter(spinnerAdapter);

        // Set the spinner selection to "All question sets"
        questionSetSpinner.setSelection(0);
        selectedQuestionSetType = "All question sets";

        questionSetSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedQuestionSetType = parent.getItemAtPosition(position).toString();
                filterQuestionSets();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });

        // Initialize question set adapter
        questionSetAdapter = new QuestionSetAdapter2(this, filteredQuestionSetList, filteredQuestionSetIds);
        questionSetsListView.setAdapter(questionSetAdapter);

        // Notify the adapter after the data is fetched
        questionSetAdapter.notifyDataSetChanged();

        questionSetsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                // Get the clicked question set from the filtered list
                QuestionSet questionSet = filteredQuestionSetList.get(position);

                // Access the field values of the clicked question set
                boolean isPublic = questionSet.getIsPublic();
                String title = questionSet.getTitle();
                Toast.makeText(QuestionSetsActivity2.this, "Question Set Title: " + title, Toast.LENGTH_SHORT).show();
                System.out.println("ID: " + filteredQuestionSetIds.get(position));
                //System.out.println(questionSet.getAuthor());
                //System.out.println(questionSet.getId());
                //System.out.println(questionSet.getQuestions().get(0).getQuestion());

                // Example actions you can perform with the field values
                if (isPublic) {
                    // Display a toast message indicating the question set is public
                    //Toast.makeText(QuestionSetsActivity2.this, "Public Question Set: " + title, Toast.LENGTH_SHORT).show();
                } else {
                    // Open a new activity and pass the title as an extra
                    //Intent intent = new Intent(QuestionSetsActivity2.this, DetailsActivity.class);
                    //intent.putExtra("title", title);
                    //startActivity(intent);
                }
            }
        });

        // Set listeners
        searchEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Do nothing
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterQuestionSets();
            }

            @Override
            public void afterTextChanged(Editable s) {
                // Do nothing
            }
        });

        createQuestionSetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Create new activity for question set creation
                Intent newIntent = new Intent(QuestionSetsActivity2.this, CreateQuestionSetActivity.class);
                startActivity(newIntent);
            }
        });

        // Initially display question sets that fit within "All question sets" category
        filterQuestionSets();
    }

    private void filterQuestionSets() {
        String searchText = searchEditText.getText().toString().toLowerCase();

        filteredQuestionSetList.clear();
        filteredQuestionSetIds.clear();

        for (int i = 0; i < questionSetList.size(); i++) {
            if (questionSetList.get(i).getTitle().toLowerCase().contains(searchText)) {
                if (selectedQuestionSetType.equals("All question sets")) {
                    if (questionSetList.get(i).getAuthor().equals(PreferenceHelper.getUsername(QuestionSetsActivity2.this)) ||
                            questionSetList.get(i).getIsPublic()) {
                        filteredQuestionSetList.add(questionSetList.get(i));
                        filteredQuestionSetIds.add(questionSetIds.get(i));
                    }
                } else {
                    if (questionSetList.get(i).getAuthor().equals(PreferenceHelper.getUsername(QuestionSetsActivity2.this))) {
                        filteredQuestionSetList.add(questionSetList.get(i));
                        filteredQuestionSetIds.add(questionSetIds.get(i));
                    }
                }
            }
        }

        questionSetAdapter.notifyDataSetChanged();
    }



    private List<QuestionSet> getQuestionSets() {
        // Get question sets data from firebase
        List<QuestionSet> questionSets = new ArrayList<>();

        DatabaseReference quizzesRef = databaseReference;

        ValueEventListener initialLoadListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot authorSnapshot : dataSnapshot.getChildren()) {
                    String authorId = authorSnapshot.getKey();

                    System.out.println(authorSnapshot.getKey());

                    DatabaseReference authorRef = quizzesRef.child(authorId);
                    authorRef.addChildEventListener(new ChildEventListener() {
                        @Override
                        public void onChildAdded(@NonNull DataSnapshot quizSnapshot, @Nullable String previousChildName) {
                            String questionSetId = dataSnapshot.getKey();
                            // Handle the added child (questionSetId) under the current "author" entry
                            System.out.println("Question set added");

                            String title = quizSnapshot.child("Title").getValue(String.class);
                            String quizAuthor = quizSnapshot.child("Author").getValue(String.class);
                            boolean isPublic = quizSnapshot.child("isPublic").getValue(Boolean.class);
                            ArrayList<Question> questions = new ArrayList<>();
                            // Retrieve the questions from Firebase
                            for (DataSnapshot questionSnapshot : quizSnapshot.child("Questions").getChildren()) {
                                boolean hasImage = questionSnapshot.child("hasImage").getValue(Boolean.class);
                                String image = questionSnapshot.child("image").getValue(String.class);
                                boolean isFlagged = questionSnapshot.child("isFlagged").getValue(Boolean.class);
                                String questionText = questionSnapshot.child("question").getValue(String.class);
                                Answer answer1 = questionSnapshot.child("answer1").getValue(Answer.class);
                                Answer answer2 = questionSnapshot.child("answer2").getValue(Answer.class);
                                Answer answer3 = questionSnapshot.child("answer3").getValue(Answer.class);
                                Answer answer4 = questionSnapshot.child("answer4").getValue(Answer.class);


                                // Retrieve other question fields as needed
                                Question question = new Question(answer1, answer2, answer3, answer4, hasImage, image, isFlagged, questionText);
                                questions.add(question);
                                //System.out.println(question.toString());
                            }
                            // Add question set to the list
                            QuestionSet questionSet = new QuestionSet(quizAuthor, questions, title, isPublic);
                            //QuestionSet questionSet = new QuestionSet(quizSnapshot.getKey(), quizAuthor, questions, title, isPublic);
                            questionSets.add(questionSet);
                            questionSetIds.add(quizSnapshot.getKey());

                            // Notify the adapter for new question sets and filter them
                            filterQuestionSets();
                            questionSetAdapter.notifyDataSetChanged();

                        }

                        @Override
                        public void onChildChanged(@NonNull DataSnapshot quizSnapshot, @Nullable String previousChildName) {
                            String questionSetId = dataSnapshot.getKey();
                            // Handle the updated child (questionSetId) under the current "author" entry
                            System.out.println("Question set changed");


                            String quizId = quizSnapshot.getKey();
                            int index = questionSetIds.indexOf(quizId);
                            if (index != -1) {
                                String title = quizSnapshot.child("Title").getValue(String.class);
                                String quizAuthor = quizSnapshot.child("Author").getValue(String.class);
                                boolean isPublic = quizSnapshot.child("isPublic").getValue(Boolean.class);
                                ArrayList<Question> questions = new ArrayList<>();

                                // Retrieve the questions from Firebase
                                for (DataSnapshot questionSnapshot : quizSnapshot.child("Questions").getChildren()) {
                                    boolean hasImage = questionSnapshot.child("hasImage").getValue(Boolean.class);
                                    String image = questionSnapshot.child("image").getValue(String.class);
                                    boolean isFlagged = questionSnapshot.child("isFlagged").getValue(Boolean.class);
                                    String questionText = questionSnapshot.child("question").getValue(String.class);
                                    Answer answer1 = questionSnapshot.child("answer1").getValue(Answer.class);
                                    Answer answer2 = questionSnapshot.child("answer2").getValue(Answer.class);
                                    Answer answer3 = questionSnapshot.child("answer3").getValue(Answer.class);
                                    Answer answer4 = questionSnapshot.child("answer4").getValue(Answer.class);

                                    // Retrieve other question fields as needed
                                    Question question = new Question(answer1, answer2, answer3, answer4, hasImage, image, isFlagged, questionText);
                                    questions.add(question);
                                }

                                // Update the existing QuestionSet object
                                QuestionSet questionSet = questionSets.get(index);
                                questionSet.setTitle(title);
                                questionSet.setAuthor(quizAuthor);
                                questionSet.setIsPublic(isPublic);
                                questionSet.setQuestions(questions);

                                // Notify the adapter for data change
                                filterQuestionSets();
                                questionSetAdapter.notifyDataSetChanged();
                            }
                        }

                        @Override
                        public void onChildRemoved(@NonNull DataSnapshot quizSnapshot) {
                            String questionSetId = dataSnapshot.getKey();
                            // Handle the removed child (questionSetId) under the current "author" entry
                            System.out.println("Question set removed");

                            String quizId = quizSnapshot.getKey();
                            int index = questionSetIds.indexOf(quizId);
                            if (index != -1) {
                                questionSets.remove(index);
                                questionSetIds.remove(index);

                                // Notify the adapter for data change
                                filterQuestionSets();
                                questionSetAdapter.notifyDataSetChanged();
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
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle any errors that occur
            }
        };

        // Attach listener to firebase
        quizzesRef.addListenerForSingleValueEvent(initialLoadListener);


        return questionSets;
    }
}
