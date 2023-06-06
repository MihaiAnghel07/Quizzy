package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.Adapters.QuestionSetAdapter;
import com.quizzy.android.DataStructures.Answer;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;

import java.util.ArrayList;
import java.util.List;

public class QuestionSetsActivity extends AppCompatActivity {

    private EditText searchEditText;
    private Button myQuestionSetsButton;
    private Button allQuestionSetsButton;
    private Button createQuestionSetButton;
    private ListView questionSetsListView;

    private DatabaseReference databaseReference;
    private Query query;
    private List<QuestionSet> questionSetList;
    private QuestionSetAdapter questionSetAdapter;

    private String currentUserId;
    private boolean isMyQuestionSetsSelected = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question_sets);

        // Get the current user ID
        currentUserId = getCurrentUserId();

        // Initialize Firebase database reference
        databaseReference = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Initialize views
        searchEditText = findViewById(R.id.searchEditText);
        myQuestionSetsButton = findViewById(R.id.myQuestionSetsButton);
        allQuestionSetsButton = findViewById(R.id.allQuestionSetsButton);
        createQuestionSetButton = findViewById(R.id.createQuestionSetButton);
        questionSetsListView = findViewById(R.id.questionSetsListView);

        // Set listeners
        myQuestionSetsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isMyQuestionSetsSelected = true;
                setButtonSelected(myQuestionSetsButton);
                setButtonUnselected(allQuestionSetsButton);
                loadQuestionSets();
            }
        });

        allQuestionSetsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isMyQuestionSetsSelected = false;
                setButtonSelected(allQuestionSetsButton);
                setButtonUnselected(myQuestionSetsButton);
                loadQuestionSets();
            }
        });

        createQuestionSetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Open CreateQuestionSetActivity
            }
        });

        questionSetList = new ArrayList<>();
        questionSetAdapter = new QuestionSetAdapter(this, questionSetList, currentUserId);
        questionSetsListView.setAdapter(questionSetAdapter);

        questionSetsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                QuestionSet questionSet = questionSetList.get(position);
                // Handle item click based on the selected button (myQuestionSets or allQuestionSets)
                if (isMyQuestionSetsSelected) {
                    // Handle myQuestionSets item click
                } else {
                    // Handle allQuestionSets item click
                }
            }
        });

        loadQuestionSets();
    }

    private void loadQuestionSets() {
        questionSetList.clear();

        // Construct the database query based on the selected button
        if (isMyQuestionSetsSelected) {
            query = databaseReference.child(currentUserId);
        } else {
            query = databaseReference;
        }

        // Add a value event listener to fetch the question sets
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot quizSnapshot : dataSnapshot.getChildren()) {
                    String title = quizSnapshot.child("Title").getValue(String.class);
                    String quizAuthor = quizSnapshot.child("Author").getValue(String.class);
                    boolean isPublic = quizSnapshot.child("isPublic").getValue(Boolean.class);
                    ArrayList<Question> questions = new ArrayList<>();
                    // Retrieve the questions from Firebase
                    for (DataSnapshot questionSnapshot : quizSnapshot.child("questions").getChildren()) {
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
                    // Add question set to the list
                    QuestionSet questionSet = new QuestionSet(quizSnapshot.getKey(), quizAuthor, questions, title, isPublic);
                    questionSetList.add(questionSet);
                }
                questionSetAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error
            }
        });
    }

    private void setButtonSelected(Button button) {
        button.setBackgroundResource(R.drawable.button_background_selected);
        button.setTextColor(getResources().getColor(R.color.white));
    }

    private void setButtonUnselected(Button button) {
        button.setBackgroundResource(R.drawable.button_background);
        button.setTextColor(getResources().getColor(R.color.white));
    }

    private String getCurrentUserId() {
        // Implement your logic to get the current user ID
        return PreferenceHelper.getUsername(QuestionSetsActivity.this);
    }
}
