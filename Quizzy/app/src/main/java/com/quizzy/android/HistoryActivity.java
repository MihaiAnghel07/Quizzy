package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;


import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class HistoryActivity extends AppCompatActivity {

    private LinearLayout quizListLayout;
    private DatabaseReference historyRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        quizListLayout = findViewById(R.id.quizListLayout);

        historyRef = FirebaseDatabase.getInstance().getReference().child("History")
                .child("participant").child(PreferenceHelper.getUsername(this)).child("quizzes");

        historyRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                quizListLayout.removeAllViews();

                for (DataSnapshot quizSnapshot : dataSnapshot.getChildren()) {
                    String quizId = quizSnapshot.getKey();
                    String quizTitle = quizSnapshot.child("quizTitle").getValue(String.class);
                    String timestamp = quizSnapshot.child("timestamp").getValue(String.class);
                    System.out.println("quizID: " + quizId + "; title: " + quizTitle + " timestamp: " + timestamp);

                    if (quizTitle != null && timestamp != null) {
                        addQuizToList(quizId, quizTitle, timestamp);
                    }
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error, if needed
            }
        });
    }

    private void addQuizToList(String quizId, String quizTitle, String timestamp) {
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.setMargins(0, 0, 0, 16);

        TextView quizItemTextView = new TextView(this);
        quizItemTextView.setLayoutParams(layoutParams);
        quizItemTextView.setText(quizTitle + " - " + timestamp);
        quizItemTextView.setTextSize(18);
        quizItemTextView.setPadding(16, 16, 16, 16);
        //quizItemTextView.setBackgroundResource(R.drawable.quiz_item_background);
        quizItemTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Open QuizDetailsActivity with quizId as extra
                Intent intent = new Intent(HistoryActivity.this, QuizDetailsActivity.class);
                intent.putExtra("quizId", quizId);
                intent.putExtra("quizTitle", quizTitle);
                intent.putExtra("timestamp", timestamp);
                startActivity(intent);
            }
        });

        quizListLayout.addView(quizItemTextView);
    }
}
