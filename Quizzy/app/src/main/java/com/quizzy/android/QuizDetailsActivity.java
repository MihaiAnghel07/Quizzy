package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;



import android.os.Bundle;
import android.view.Gravity;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.squareup.picasso.Picasso;

public class QuizDetailsActivity extends AppCompatActivity {

    private LinearLayout questionListLayout;
    private DatabaseReference quizRef;
    private TextView quizTitleTextView;
    private TextView scoreTextView;
    private int score;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz_details);

        questionListLayout = findViewById(R.id.questionListLayout);

        String username = PreferenceHelper.getUsername(this);
        String quizId = getIntent().getStringExtra("quizId");

        quizTitleTextView = findViewById(R.id.quizTitleTextView);
        quizTitleTextView.setText(getIntent().getStringExtra("quizTitle") + "\n" +
                                    getIntent().getStringExtra("timestamp"));
        scoreTextView = findViewById(R.id.scoreTextView);
        score = 0;

        FirebaseStorage storage = FirebaseStorage.getInstance();
        StorageReference storageRef = storage.getReference();

        quizRef = FirebaseDatabase.getInstance().getReference()
                .child("History")
                .child("participant")
                .child(username)
                .child("quizzes")
                .child(quizId)
                .child("questions");

        quizRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                questionListLayout.removeAllViews();
                int questionCount = 0;
                for (DataSnapshot questionSnapshot : dataSnapshot.getChildren()) {
                    String question = String.valueOf(++questionCount) + ". " + questionSnapshot.child("question").getValue(String.class);

                    LinearLayout questionLayout = new LinearLayout(QuizDetailsActivity.this);
                    questionLayout.setOrientation(LinearLayout.VERTICAL);

                    TextView questionTextView = new TextView(QuizDetailsActivity.this);
                    questionTextView.setText(question);
                    questionTextView.setTextSize(18);
                    questionTextView.setTextColor(Color.BLACK);
                    questionTextView.setPadding(0, 0, 0, 8);
                    questionLayout.addView(questionTextView);

                    // Add question image
                    if (questionSnapshot.child("hasImage").getValue(Boolean.class)) {
                        ImageView questionImageView = new ImageView(QuizDetailsActivity.this);
                        String imageName = questionSnapshot.child("image").getValue(String.class);
                        String imagePath = "History/participant/" + PreferenceHelper.getUsername(QuizDetailsActivity.this) + "/quizzes/" + quizId + "/questions/" + questionSnapshot.getKey() + "/" + imageName;
                        //String imagePath = "/History/participant/user3/quizzes/1685717718679/questions/0/1200px-Un1.svg.png";
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
                        questionLayout.addView(questionImageView);
                    }



                    for (DataSnapshot answerSnapshot : questionSnapshot.getChildren()) {
                        String answerKey = answerSnapshot.getKey();
                        if (answerKey.startsWith("answer")) {
                            boolean isCorrect = answerSnapshot.child("isCorrect").getValue(Boolean.class);
                            boolean isSelected = answerSnapshot.child("isSelected").getValue(Boolean.class);
                            String answerText = answerSnapshot.child("text").getValue(String.class);

                            TextView answerTextView = new TextView(QuizDetailsActivity.this);
                            answerTextView.setGravity(Gravity.CENTER_VERTICAL);
                            answerTextView.setText(answerText);
                            answerTextView.setTextSize(16);
                            answerTextView.setTextColor(Color.BLACK);
                            answerTextView.setCompoundDrawablePadding(8);
                            if (isCorrect && isSelected) {
                                score++;
                                scoreTextView.setText("Score: " + String.valueOf(score) + "/" + String.valueOf(questionCount));
                            }

                            if (!isCorrect && isSelected) {
                                answerTextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_cross_mark2, 0);
                                answerTextView.setTextColor(Color.RED);
                            } else if (isCorrect) {
                                answerTextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_mark2, 0);
                                answerTextView.setTextColor(Color.GREEN);
                            }

                            questionLayout.addView(answerTextView);
                        }
                    }

                    questionListLayout.addView(questionLayout);
                    TextView emptyTextView = new TextView(QuizDetailsActivity.this);
                    questionListLayout.addView(emptyTextView);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error, if needed
            }
        });



    }
}

