package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.DataStructures.Answer;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;

import java.util.ArrayList;

public class CreateQuestionSetActivity extends AppCompatActivity {

    private EditText questionSetTitleEditText;
    private EditText questionTextEditText;
    private EditText answer1EditText;
    private EditText answer2EditText;
    private EditText answer3EditText;
    private EditText answer4EditText;
    private Spinner correctAnswerSpinner;
    private Spinner visibilitySpinner;
    private Button createButton;

    private DatabaseReference databaseRef;

    private String username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_question_set);

        // Get username
        username = PreferenceHelper.getUsername(CreateQuestionSetActivity.this);

        // Initialize views
        questionSetTitleEditText = findViewById(R.id.questionSetTitleEditText);
        questionTextEditText = findViewById(R.id.questionTextEditText);
        answer1EditText = findViewById(R.id.answer1EditText);
        answer2EditText = findViewById(R.id.answer2EditText);
        answer3EditText = findViewById(R.id.answer3EditText);
        answer4EditText = findViewById(R.id.answer4EditText);
        correctAnswerSpinner = findViewById(R.id.correctAnswerSpinner);
        visibilitySpinner = findViewById(R.id.visibilitySpinner);
        createButton = findViewById(R.id.createButton);

        // Firebase database reference
        databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Set up spinner adapters
        correctAnswerSpinner.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.answer_options)));
        visibilitySpinner.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.visibility_options)));

        // Set default spinner selections
        correctAnswerSpinner.setSelection(0);
        visibilitySpinner.setSelection(0);

        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                createQuestionSet();
            }
        });
    }

    private void createQuestionSet() {
        String title = questionSetTitleEditText.getText().toString().trim();
        String questionText = questionTextEditText.getText().toString().trim();
        String answer1Text = answer1EditText.getText().toString().trim();
        String answer2Text = answer2EditText.getText().toString().trim();
        String answer3Text = answer3EditText.getText().toString().trim();
        String answer4Text = answer4EditText.getText().toString().trim();
        int correctAnswerIndex = correctAnswerSpinner.getSelectedItemPosition();
        String visibility = visibilitySpinner.getSelectedItem().toString();

        // Check if all fields are filled
        if (title.isEmpty() || questionText.isEmpty() || answer1Text.isEmpty() || answer2Text.isEmpty() || answer3Text.isEmpty() || answer4Text.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Check if the question set title is unique
        isQuestionSetTitleUnique(title, new UniqueTitleListener() {
            @Override
            public void onTitleCheckResult(boolean isUnique) {
                if (isUnique) {
                    // Title is unique, proceed with creating the question set
                    // Generate a unique quiz ID using current timestamp
                    String quizId = String.valueOf(System.currentTimeMillis());

                    // Create QuestionSet object
                    QuestionSet questionSet = new QuestionSet();
                    questionSet.setAuthor(username);
                    questionSet.setTitle(title);
                    questionSet.setIsPublic(visibility.equalsIgnoreCase("Public"));

                    // Create Question object
                    Question question = new Question();
                    question.setQuestion(questionText);
                    question.setHasImage(false);
                    question.setImage("");
                    question.setIsFlagged(false);

                    // Create Answer objects
                    ArrayList<Answer> answers = new ArrayList<>();
                    answers.add(new Answer(correctAnswerIndex == 0, answer1Text));
                    answers.add(new Answer(correctAnswerIndex == 1, answer2Text));
                    answers.add(new Answer(correctAnswerIndex == 2, answer3Text));
                    answers.add(new Answer(correctAnswerIndex == 3, answer4Text));

                    question.setAnswer1(answers.get(0));
                    question.setAnswer2(answers.get(1));
                    question.setAnswer3(answers.get(2));
                    question.setAnswer4(answers.get(3));

                    // Add Question object to the QuestionSet
                    ArrayList<Question> questions = new ArrayList<>();
                    questions.add(question);
                    questionSet.setQuestions(questions);

                    // Save QuestionSet to Firebase Realtime Database
                    databaseRef.child(username).child(quizId).setValue(questionSet);

                    Toast.makeText(CreateQuestionSetActivity.this, "Question Set created successfully", Toast.LENGTH_SHORT).show();

                    // Start Add Question Activity
                    Intent newIntent = new Intent(CreateQuestionSetActivity.this, AddQuestionActivity.class);
                    newIntent.putExtra("quizId", quizId);
                    startActivity(newIntent);
                    finish();
                } else {
                    // Title already exists
                    Toast.makeText(CreateQuestionSetActivity.this, "Question Set with the same title already exists", Toast.LENGTH_SHORT).show();
                }
            }
        });
//        if (isQuestionSetTitleUnique(title)) {
//            // Generate a unique quiz ID using current timestamp
//            String quizId = String.valueOf(System.currentTimeMillis());
//
//            // Create QuestionSet object
//            QuestionSet questionSet = new QuestionSet();
//            questionSet.setId(quizId);
//            questionSet.setAuthor("YourUsername"); // Set the appropriate username
//            questionSet.setTitle(title);
//            questionSet.setPublic(visibility.equalsIgnoreCase("Public"));
//
//            // Create Question object
//            Question question = new Question();
//            question.setQuestion(questionText);
//            question.setHasImage(false); // Set this based on your requirements
//            question.setImage(""); // Set this based on your requirements
//            question.setFlagged(false); // Set this based on your requirements
//
//            // Create Answer objects
//            ArrayList<Answer> answers = new ArrayList<>();
//            answers.add(new Answer(correctAnswerIndex == 0, answer1Text));
//            answers.add(new Answer(correctAnswerIndex == 1, answer2Text));
//            answers.add(new Answer(correctAnswerIndex == 2, answer3Text));
//            answers.add(new Answer(correctAnswerIndex == 3, answer4Text));
//
//            question.setAnswer1(answers.get(0));
//            question.setAnswer2(answers.get(1));
//            question.setAnswer3(answers.get(2));
//            question.setAnswer4(answers.get(3));
//
//            // Add Question object to the QuestionSet
//            ArrayList<Question> questions = new ArrayList<>();
//            questions.add(question);
//            questionSet.setQuestions(questions);
//
//            // Save QuestionSet to Firebase Realtime Database
//            databaseRef.child("YourUsername").child(quizId).setValue(questionSet);
//
//            Toast.makeText(this, "Question Set created successfully", Toast.LENGTH_SHORT).show();
//            finish();
//        } else {
//            Toast.makeText(this, "Question Set with the same title already exists", Toast.LENGTH_SHORT).show();
//        }
    }

    private interface UniqueTitleListener {
        void onTitleCheckResult(boolean isUnique);
    }

    private void isQuestionSetTitleUnique(String title, UniqueTitleListener listener) {
        DatabaseReference userRef = databaseRef.child(username);
        userRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot quizSnapshot : dataSnapshot.getChildren()) {
                    String currentQuizTitle = quizSnapshot.child("Title").getValue(String.class);
                    //QuestionSet questionSet = quizSnapshot.getValue(QuestionSet.class);
                    if (currentQuizTitle != null && currentQuizTitle.equals(title)) {
                        // Title already exists
                        listener.onTitleCheckResult(false);
                        return;
                    }
                }
                // Title is unique
                listener.onTitleCheckResult(true);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Error occurred while fetching data
                listener.onTitleCheckResult(false);
            }
        });
    }

}
