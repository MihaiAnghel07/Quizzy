package com.quizzy.android;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class QuizDetailsHostActivity extends AppCompatActivity {

    private ListView participantListView;
    private TextView avgScoreTextView, ratingTextView, titleTextView, timestampTextView;

    DatabaseReference dbReference;
    String quizId, quizTitle, timestamp, username;

    double scoreSum, scoreCount;
    int questionsCount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz_details_host);

        // Find views
        titleTextView = findViewById(R.id.titleTextView);
        timestampTextView = findViewById(R.id.timestampTextView);
        avgScoreTextView = findViewById(R.id.avgScoreTextView);
        ratingTextView = findViewById(R.id.ratingTextView);
        Button viewFeedbackButton = findViewById(R.id.viewFeedbackButton);
        Button viewStatisticsButton = findViewById(R.id.viewStatisticsButton);
        participantListView = findViewById(R.id.participantListView);

        // Get database reference
        dbReference = FirebaseDatabase.getInstance().getReference();

        // Get intent extras
        quizId = getIntent().getStringExtra("quizId");
        quizTitle = getIntent().getStringExtra("quizTitle");
        timestamp = getIntent().getStringExtra("timestamp");

        // Get username
        username = PreferenceHelper.getUsername(QuizDetailsHostActivity.this);

        // Set TextViews
        titleTextView.setText(quizTitle);
        timestampTextView.setText(timestamp);
        computeRating();
        computeAverageScore();

        // Init score variables
        scoreCount = 0;
        scoreSum = 0;
        questionsCount = 0;


        // Set click listeners for buttons
        viewFeedbackButton.setOnClickListener(v -> {
            Intent intent = new Intent(QuizDetailsHostActivity.this, ViewFeedbackActivity.class);
            intent.putExtra("quizId", quizId);
            startActivity(intent);
        });

        viewStatisticsButton.setOnClickListener(v -> {
            Intent intent = new Intent(QuizDetailsHostActivity.this, ViewStatisticsActivity.class);
            intent.putExtra("quizId", quizId);
            startActivity(intent);
        });

        // Populate participant names in the ListView
        ArrayList<String> participantNames = getParticipantNames(); // Replace with your logic to get participant names
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, participantNames);
        participantListView.setAdapter(adapter);

        // Set item click listener for participants ListView
        participantListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String participantName = participantNames.get(position);

                // Start QuizDetailsActivity (participant)
                Intent intent = new Intent(QuizDetailsHostActivity.this, QuizDetailsActivity.class);
                intent.putExtra("username", participantName);
                intent.putExtra("quizId", quizId);
                intent.putExtra("quizTitle", quizTitle);
                intent.putExtra("timestamp", timestamp);
                intent.putExtra("displayUsername", true);
                startActivity(intent);
            }
        });
    }

    private ArrayList<String> getParticipantNames() {
        // Replace with your logic to get participant names from a data source
        ArrayList<String> participantNames = new ArrayList<>();

        dbReference.child("History").child("host").child(username).child("quizzes").child(quizId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for (DataSnapshot participantSnapshot : snapshot.getChildren()) {
                    if (!participantSnapshot.getKey().equals("timestamp") && !participantSnapshot.getKey().equals("quizTitle")
                    && !participantSnapshot.getKey().equals("feedbacks") && !participantSnapshot.getKey().equals("ratings")) {
                        participantNames.add(participantSnapshot.getKey());
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });


        return participantNames;
    }

    private void computeRating() {
        dbReference.child("History").child("host").child(username).child("quizzes")
                .child(quizId).child("ratings").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                double ratingSum = 0;
                double ratingCount = 0;
                for (DataSnapshot ratingSnapshot : snapshot.getChildren()) {
                    ratingSum += ratingSnapshot.child("rating").getValue(Integer.class);
                    ratingCount++;
                }
                // Trim rating value
                DecimalFormat decimalFormat = new DecimalFormat("#.#");
                if (ratingCount == 0) {
                    ratingTextView.setText("Rating: No Rating");
                } else {
                    String rating = decimalFormat.format(ratingSum / ratingCount);
                    ratingTextView.setText("Rating: " + rating + "/5");
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    private void computeAverageScore() {
        dbReference.child("History").child("host").child(username).child("quizzes")
                .child(quizId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for (DataSnapshot participantSnapshot : snapshot.getChildren()) {
                    if (!participantSnapshot.getKey().equals("timestamp") && !participantSnapshot.getKey().equals("quizTitle")
                            && !participantSnapshot.getKey().equals("feedbacks") && !participantSnapshot.getKey().equals("ratings")) {
                        scoreCount++;
                        dbReference.child("History").child("host").child(username).child("quizzes")
                                .child(quizId).child(participantSnapshot.getKey()).child("questions").addListenerForSingleValueEvent(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot questionsSnapshot) {
                                        questionsCount = 0;
                                        for (DataSnapshot questionSnapshot : questionsSnapshot.getChildren()) {
                                            questionsCount++;
                                            AnswerData answer1 = new AnswerData();
                                            AnswerData answer2 = new AnswerData();
                                            AnswerData answer3 = new AnswerData();
                                            AnswerData answer4 = new AnswerData();

                                            answer1.setCorrect(questionSnapshot.child("answer1")
                                                    .child("isCorrect").getValue(Boolean.class));
                                            answer1.setSelected(questionSnapshot.child("answer1")
                                                    .child("isSelected").getValue(Boolean.class));

                                            answer2.setCorrect(questionSnapshot.child("answer2")
                                                    .child("isCorrect").getValue(Boolean.class));
                                            answer2.setSelected(questionSnapshot.child("answer2")
                                                    .child("isSelected").getValue(Boolean.class));

                                            answer3.setCorrect(questionSnapshot.child("answer3")
                                                    .child("isCorrect").getValue(Boolean.class));
                                            answer3.setSelected(questionSnapshot.child("answer3")
                                                    .child("isSelected").getValue(Boolean.class));

                                            answer4.setCorrect(questionSnapshot.child("answer4")
                                                    .child("isCorrect").getValue(Boolean.class));
                                            answer4.setSelected(questionSnapshot.child("answer4")
                                                    .child("isSelected").getValue(Boolean.class));

                                            if (    (answer1.isCorrect() && answer1.isSelected()) ||
                                                    (answer2.isCorrect() && answer2.isSelected()) ||
                                                    (answer3.isCorrect() && answer3.isSelected()) ||
                                                    (answer4.isCorrect() && answer4.isSelected())) {
                                                scoreSum++;

                                            }
                                        }

                                        // Trim score value
                                        DecimalFormat decimalFormat = new DecimalFormat("#.#");
                                        if (scoreCount == 0) {
                                            avgScoreTextView.setText("Rating: No Score");
                                        } else {
                                            String score = decimalFormat.format(scoreSum / scoreCount);
                                            avgScoreTextView.setText("Avg. Score: " + score + "/" + questionsCount);
                                        }
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError error) {

                                    }
                                });
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });


    }
}
