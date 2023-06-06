package com.quizzy.android;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.os.Bundle;

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

public class AddQuestionActivity extends AppCompatActivity {

    private EditText questionTextEditText;
    private EditText answer1EditText;
    private EditText answer2EditText;
    private EditText answer3EditText;
    private EditText answer4EditText;
    private Spinner correctAnswerSpinner;
    private Button addButton, doneButton;

    private DatabaseReference databaseRef;

    private String username;
    private String quizId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_question);

        // Get username
        username = PreferenceHelper.getUsername(AddQuestionActivity.this);
        quizId = getIntent().getStringExtra("quizId");

        // Initialize views
        questionTextEditText = findViewById(R.id.questionTextEditText);
        answer1EditText = findViewById(R.id.answer1EditText);
        answer2EditText = findViewById(R.id.answer2EditText);
        answer3EditText = findViewById(R.id.answer3EditText);
        answer4EditText = findViewById(R.id.answer4EditText);
        correctAnswerSpinner = findViewById(R.id.correctAnswerSpinner);
        addButton = findViewById(R.id.addButton);
        doneButton = findViewById(R.id.doneButton);

        // Firebase database reference
        databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");

        // Set up spinner adapters
        correctAnswerSpinner.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, getResources().getStringArray(R.array.answer_options)));

        // Set default spinner selections
        correctAnswerSpinner.setSelection(0);

        addButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addQuestion();
            }
        });

        doneButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayDialog();
            }
        });
    }

    private void displayDialog() {
        // Display confirmation dialog
        String message = "Are you done adding questions?";
        String questionText = questionTextEditText.getText().toString().trim();
        String answer1Text = answer1EditText.getText().toString().trim();
        String answer2Text = answer2EditText.getText().toString().trim();
        String answer3Text = answer3EditText.getText().toString().trim();
        String answer4Text = answer4EditText.getText().toString().trim();
        if (!questionText.isEmpty() || !answer1Text.isEmpty() || !answer2Text.isEmpty() || !answer3Text.isEmpty() || !answer4Text.isEmpty()) {
            message = "You have unsaved changes. Are you sure you want to exit?";
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(message)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // If the user confirms, call the super method to allow the back navigation
                        finish();
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // If the user cancels, dismiss the dialog
                        dialog.dismiss();
                    }
                });

        // Create and show the dialog
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void addQuestion() {
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

        // Generate a unique quiz ID using current timestamp
        String questionId = String.valueOf(System.currentTimeMillis());


        // Create Question object
        Question question = new Question();
        question.setQuestion(questionText);
        question.setHasImage(false); // Set this based on your requirements
        question.setImage(""); // Set this based on your requirements
        question.setIsFlagged(false); // Set this based on your requirements

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

        // Save QuestionSet to Firebase Realtime Database
        databaseRef.child(username).child(quizId).child("Questions").child(questionId).setValue(question);

        Toast.makeText(AddQuestionActivity.this, "Question added successfully", Toast.LENGTH_SHORT).show();


        // Clear fields
        questionTextEditText.setText("");
        answer1EditText.setText("");
        answer2EditText.setText("");
        answer3EditText.setText("");
        answer4EditText.setText("");
        correctAnswerSpinner.setSelection(0);
    }
//
}

