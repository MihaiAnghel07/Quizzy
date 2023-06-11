package com.quizzy.android;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.format.DateFormat;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.squareup.picasso.Picasso;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class QuizActivity extends AppCompatActivity {

    private DatabaseReference questionsRef;
    private CountDownTimer timer;

    private String lobbyCode;
    private String lobbyId;
    private String quizAuthor;
    private String username;
    private int durationMinutes;
    private Date quizEndTime;

    private int currentQuestionIndex = 0;
    private int questionCount = 0;
    private int selectedAnswerIndex = -1;
    private boolean currentQuestionIsFlagged = false;

    private TextView questionNumberTextView;
    private TextView timerTextView;
    private Button flagButton;
    private TextView questionTextView;
    private ImageView questionImageView;
    private Button answer1Button;
    private Button answer2Button;
    private Button answer3Button;
    private Button answer4Button;
    int score = 0;

    FirebaseStorage storage;
    StorageReference storageRef;

    private ArrayList<QuestionData> questions;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        // Wait for images to be written in firebase storage
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        storage = FirebaseStorage.getInstance();
        storageRef = storage.getReference();

        username = PreferenceHelper.getUsername(QuizActivity.this);
        questions = new ArrayList<>();


        // Get the lobby code from the previous activity
        lobbyCode = getIntent().getStringExtra("lobbyCode");

        // Initialize the views
        questionNumberTextView = findViewById(R.id.questionNumberTextView);
        timerTextView = findViewById(R.id.timerTextView);
        flagButton = findViewById(R.id.flagButton);
        questionTextView = findViewById(R.id.questionTextView);
        questionImageView = findViewById(R.id.questionImageView);
        answer1Button = findViewById(R.id.answer1Button);
        answer2Button = findViewById(R.id.answer2Button);
        answer3Button = findViewById(R.id.answer3Button);
        answer4Button = findViewById(R.id.answer4Button);

        // Load the lobby data from Firebase
        loadLobbyData();

        // Attach listeners to the answer buttons
        answer1Button.setOnClickListener(view -> {
            handleAnswerButtonClick(0);
        });

        answer2Button.setOnClickListener(view -> {
            handleAnswerButtonClick(1);
        });

        answer3Button.setOnClickListener(view -> {
            handleAnswerButtonClick(2);
        });

        answer4Button.setOnClickListener(view -> {
            handleAnswerButtonClick(3);
        });

        // Attach listened for flag button
        flagButton.setOnClickListener(view -> {
            handleFlagButtonClick();
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Cancel the timer when the activity is destroyed
        cancelTimer();
    }

    private void loadLobbyData() {
        DatabaseReference lobbiesRef = FirebaseDatabase.getInstance().getReference().child("Lobbies");
        lobbiesRef.child(lobbyCode).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    lobbyId = snapshot.child("lobbyId").getValue(String.class);
                    quizAuthor = snapshot.child("host").getValue(String.class);
                    durationMinutes = Integer.valueOf(snapshot.child("duration").getValue(String.class));
                    String timestamp = snapshot.child("timestamp").getValue(String.class);

                    try {
                        // Parse the timestamp to calculate the quiz end time
                        SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy, hh:mm:ss a", Locale.US);
                        Date quizStartTime = format.parse(timestamp);
                        quizEndTime = new Date(quizStartTime.getTime() + TimeUnit.MINUTES.toMillis(durationMinutes));

                        // Start the quiz timer
                        startTimer();
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    // Load the quiz questions
                    loadQuizQuestions();
                } else {
                    // Lobby not found
                    Toast.makeText(QuizActivity.this, "Invalid lobby code", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                // Handle database error
            }
        });
    }

    private void loadQuizQuestions() {
        DatabaseReference userQuestionsRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("participant")
                .child(username)
                .child("quizzes")
                .child(lobbyId)
                .child("questions");

        userQuestionsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    // Get the list of questions
                    for (DataSnapshot questionSnapshot : snapshot.getChildren()) {
                        // Retrieve question data
                        boolean hasImage = questionSnapshot.child("hasImage").getValue(Boolean.class);
                        String image = questionSnapshot.child("image").getValue(String.class);
                        boolean isFlagged = questionSnapshot.child("isFlagged").getValue(Boolean.class);
                        String question = questionSnapshot.child("question").getValue(String.class);

                        // Retrieve answer data
                        AnswerData answer1 = questionSnapshot.child("answer1").getValue(AnswerData.class);
                        AnswerData answer2 = questionSnapshot.child("answer2").getValue(AnswerData.class);
                        AnswerData answer3 = questionSnapshot.child("answer3").getValue(AnswerData.class);
                        AnswerData answer4 = questionSnapshot.child("answer4").getValue(AnswerData.class);

                        // Display the question and answers in the UI
                        //displayQuestionAndAnswers(question, hasImage, image, answer1, answer2, answer3, answer4);

                        String id = questionSnapshot.getKey();
                        questions.add(new QuestionData(answer1, answer2, answer3, answer4,
                                                        hasImage, image, isFlagged, question, id));
                        questionCount++;
                    }
                    loadNextQuestion();
                } else {
                    // No questions found
                    Toast.makeText(QuizActivity.this, "No questions found", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                // Handle database error
            }
        });
    }

    private void displayQuestionAndAnswers(String question, boolean hasImage, String image, AnswerData answer1, AnswerData answer2, AnswerData answer3, AnswerData answer4, String questionId) {
        // Set the question text
        questionTextView.setText(question);

        // Load the image if available
        if (hasImage) {
            // Use Picasso or any other library to load the image into the ImageView
            String imagePath = "History/participant/" + username + "/quizzes/" + lobbyId +"/questions/" + questionId +"/" + image;
            StorageReference imageRef = storageRef.child(imagePath);
            imageRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                @Override
                public void onSuccess(Uri uri) {
                    // Load the image using Picasso
                    Picasso.get().load(uri).into(questionImageView);
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception exception) {
                    // Handle any errors that occur during image retrieval
                }
            });
            questionImageView.setVisibility(View.VISIBLE);
        } else {
            questionImageView.setVisibility(View.GONE);
        }

        // Set the answer button text
        answer1Button.setText(answer1.getText());
        answer2Button.setText(answer2.getText());
        answer3Button.setText(answer3.getText());
        answer4Button.setText(answer4.getText());

        questionNumberTextView.setText(currentQuestionIndex+1 + "/" + questionCount);
    }

    private void startTimer() {
        timer = new CountDownTimer(quizEndTime.getTime() - System.currentTimeMillis(), 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                // Calculate the remaining time
                long seconds = TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) % 60;
                long minutes = TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished) % 60;
                //long hours = TimeUnit.MILLISECONDS.toHours(millisUntilFinished) % 24;
                //String timeLeft = String.format(Locale.getDefault(), "%02d:%02d:%02d", hours, minutes, seconds);
                String timeLeft = String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);

                // Update the timer TextView
                timerTextView.setText(timeLeft);

                if (minutes < 1) {
                    timerTextView.setTextColor(Color.RED);
                }
            }

            @Override
            public void onFinish() {
                // Timer expired, handle the quiz completion
                // Redirect the user to a new activity
                System.out.println("SCORE: " + score);
                Intent intent = new Intent(QuizActivity.this, FeedbackActivity.class);
                intent.putExtra("title", "You scored " + score + " out of " + questionCount);
                intent.putExtra("quizId", lobbyId);
                intent.putExtra("quizAuthor", quizAuthor);
                startActivity(intent);
                finish();
            }
        };

        timer.start();
    }

    private void cancelTimer() {
        if (timer != null) {
            timer.cancel();
        }
    }

    private void handleAnswerButtonClick(int answerIndex) {
        // Set isFlagged field in firebase for current question
        DatabaseReference flagQuestionRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("host")
                .child(quizAuthor)
                .child("quizzes")
                .child(lobbyId)
                .child(username)
                .child("questions")
                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
                .child("isFlagged");

        flagQuestionRef.setValue(currentQuestionIsFlagged);

        // Reset flag
        flagButton.setText("Flag");
        currentQuestionIsFlagged = false;

        // Save the selected answer for participant history
        DatabaseReference participantQuestionRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("participant")
                .child(username)
                .child("quizzes")
                .child(lobbyId)
                .child("questions")
                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
                .child("answer" + (answerIndex + 1))
                .child("isSelected");

        participantQuestionRef.setValue(true);

        // Save the selected answer for host history
        DatabaseReference hostQuestionRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("host")
                .child(quizAuthor)
                .child("quizzes")
                .child(lobbyId)
                .child(username)
                .child("questions")
                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
                .child("answer" + (answerIndex + 1))
                .child("isSelected");

        hostQuestionRef.setValue(true);


        // Check if answer is correct
        // Update score and update statistics
        DatabaseReference correctRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("host")
                .child(quizAuthor)
                .child("quizzes")
                .child(lobbyId)
                .child(username)
                .child("questions")
                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
                .child("answer" + (answerIndex + 1));

        correctRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    boolean correct = snapshot.child("isCorrect").getValue(Boolean.class);
                    if (correct) {
                        score++;
                        // Try calculating the score in the feedback activity, by interrogating
                        // the database, the same as in quiz details activity
                        System.out.println("You guessed it!");

//                        // Increment correctAnswers in Statistics
//                        DatabaseReference correctAnswersRef = FirebaseDatabase.getInstance().getReference()
//                                .child("Statistics")
//                                .child("host")
//                                .child(quizAuthor)
//                                .child("quizzes")
//                                .child(lobbyId)
//                                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
//                                .child("correctAnswers");
//
//                        correctAnswersRef.addListenerForSingleValueEvent(new ValueEventListener() {
//                            @Override
//                            public void onDataChange(@NonNull DataSnapshot snapshot) {
//                                int correctAnswers = snapshot.getValue(Integer.class);
//                                correctAnswers++;
//                                correctAnswersRef.setValue(correctAnswers);
//                            }
//
//                            @Override
//                            public void onCancelled(@NonNull DatabaseError error) {
//
//                            }
//                        });
                    } else {
                        // Increment wrongAnswers in Statistics
//                        DatabaseReference wrongAnswersRef = FirebaseDatabase.getInstance().getReference()
//                                .child("Statistics")
//                                .child("host")
//                                .child(quizAuthor)
//                                .child("quizzes")
//                                .child(lobbyId)
//                                .child(String.valueOf(questions.get(currentQuestionIndex).getId()))
//                                .child("wrongAnswers");
//
//                        wrongAnswersRef.addListenerForSingleValueEvent(new ValueEventListener() {
//                            @Override
//                            public void onDataChange(@NonNull DataSnapshot snapshot) {
//                                int wrongAnswers = snapshot.getValue(Integer.class);
//                                wrongAnswers++;
//                                wrongAnswersRef.setValue(wrongAnswers);
//                            }
//
//                            @Override
//                            public void onCancelled(@NonNull DatabaseError error) {
//
//                            }
//                        });
                    }
                    currentQuestionIndex++;
                    loadNextQuestion();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                // Handle database error
            }
        });

        // Increment the question index and load the next question
        //(moved the code below in the singleEventListener above, so the score is synchronized)
        //currentQuestionIndex++;
        //loadNextQuestion();
    }


    private void loadNextQuestion() {
        if (currentQuestionIndex >= questionCount) {
            // Quiz completed, handle the completion logic
            // Redirect the user to feedback activity

            // Wait for score to be updated after last question
//            try {
//                Thread.sleep(2000);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }

            System.out.println("SCORE: " + score);
            Intent intent = new Intent(QuizActivity.this, FeedbackActivity.class);
            intent.putExtra("title", "You scored " + score + " out of " + questionCount);
            intent.putExtra("quizId", lobbyId);
            intent.putExtra("quizAuthor", quizAuthor);
            startActivity(intent);
            finish();
            return;
        }

        if (currentQuestionIndex == 0) {
            // Wait for first image to load
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        displayQuestionAndAnswers(questions.get(currentQuestionIndex).getQuestion(),
                                    questions.get(currentQuestionIndex).getHasImage(),
                                    questions.get(currentQuestionIndex).getImage(),
                                    questions.get(currentQuestionIndex).getAnswer1(),
                                    questions.get(currentQuestionIndex).getAnswer2(),
                                    questions.get(currentQuestionIndex).getAnswer3(),
                                    questions.get(currentQuestionIndex).getAnswer4(),
                                    questions.get(currentQuestionIndex).getId());
    }

    private void handleFlagButtonClick() {
        if (currentQuestionIsFlagged) {
            Toast.makeText(QuizActivity.this, "Question flag removed", Toast.LENGTH_SHORT).show();
            flagButton.setText("Flag");
            currentQuestionIsFlagged = false;
        } else {
            Toast.makeText(QuizActivity.this, "Question has been flagged", Toast.LENGTH_SHORT).show();
            flagButton.setText("Unflag");
            currentQuestionIsFlagged = true;
        }

    }

    @Override
    public void onBackPressed() {
        // Display confirmation dialog
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Are you sure you want to leave the quiz?")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // If the user confirms, call the super method to allow the back navigation
                        QuizActivity.super.onBackPressed();
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

}
