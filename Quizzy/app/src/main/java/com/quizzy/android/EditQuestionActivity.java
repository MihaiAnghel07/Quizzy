package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import androidx.appcompat.app.AlertDialog;
import android.content.DialogInterface;

import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.DataStructures.Answer;
import com.quizzy.android.DataStructures.Question;

import java.util.ArrayList;

public class EditQuestionActivity extends AppCompatActivity {

    private EditText questionTextEditText;
    private EditText answer1EditText;
    private EditText answer2EditText;
    private EditText answer3EditText;
    private EditText answer4EditText;
    private Spinner correctAnswerSpinner;
    private Button saveButton;

    private DatabaseReference databaseRef;

    private String username;
    private String quizId;
    private String questionId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_question);

        // Get username
        username = PreferenceHelper.getUsername(EditQuestionActivity.this);
        quizId = getIntent().getStringExtra("quizId");
        questionId = getIntent().getStringExtra("questionId");

        // Initialize views
        questionTextEditText = findViewById(R.id.questionTextEditText);
        answer1EditText = findViewById(R.id.answer1EditText);
        answer2EditText = findViewById(R.id.answer2EditText);
        answer3EditText = findViewById(R.id.answer3EditText);
        answer4EditText = findViewById(R.id.answer4EditText);
        correctAnswerSpinner = findViewById(R.id.correctAnswerSpinner);
        saveButton = findViewById(R.id.saveButton);


        // Firebase database reference
        databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Set up spinner adapters
        correctAnswerSpinner.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.answer_options)));

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editQuestion();
            }
        });


        // Load question data
        loadQuestionData();
    }

    private void loadQuestionData() {
        databaseRef.child(username).child(quizId).child("Questions").child(questionId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                // Read current question data from firebase
                boolean hasImage = snapshot.child("hasImage").getValue(Boolean.class);
                String image = snapshot.child("image").getValue(String.class);
                boolean isFlagged = snapshot.child("isFlagged").getValue(Boolean.class);
                String questionText = snapshot.child("question").getValue(String.class);
                Answer answer1 = snapshot.child("answer1").getValue(Answer.class);
                Answer answer2 = snapshot.child("answer2").getValue(Answer.class);
                Answer answer3 = snapshot.child("answer3").getValue(Answer.class);
                Answer answer4 = snapshot.child("answer4").getValue(Answer.class);
                Question question = new Question(answer1, answer2, answer3, answer4, hasImage, image, isFlagged, questionText);

                // Load data into widgets
                questionTextEditText.setText(question.getQuestion());
                answer1EditText.setText(question.getAnswer1().getText());
                answer2EditText.setText(question.getAnswer2().getText());
                answer3EditText.setText(question.getAnswer3().getText());
                answer4EditText.setText(question.getAnswer4().getText());
                if (answer1.getIsCorrect()) {
                    correctAnswerSpinner.setSelection(0);
                } else if (answer2.getIsCorrect()) {
                    correctAnswerSpinner.setSelection(1);
                } else if (answer3.getIsCorrect()) {
                    correctAnswerSpinner.setSelection(2);
                } else {
                    correctAnswerSpinner.setSelection(3);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }


    private void editQuestion() {
        String questionText = questionTextEditText.getText().toString().trim();
        String answer1Text = answer1EditText.getText().toString().trim();
        String answer2Text = answer2EditText.getText().toString().trim();
        String answer3Text = answer3EditText.getText().toString().trim();
        String answer4Text = answer4EditText.getText().toString().trim();
        int correctAnswerIndex = correctAnswerSpinner.getSelectedItemPosition();

        // Check if all fields are filled
        if (questionText.isEmpty() || answer1Text.isEmpty() || answer2Text.isEmpty() || answer3Text.isEmpty() || answer4Text.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

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


        // Save Question to Firebase Realtime Database
        databaseRef.child(username).child(quizId).child("Questions").child(questionId).setValue(question);

        Toast.makeText(EditQuestionActivity.this, "Changes saved successfully", Toast.LENGTH_SHORT).show();
        finish();
    }
//
}

