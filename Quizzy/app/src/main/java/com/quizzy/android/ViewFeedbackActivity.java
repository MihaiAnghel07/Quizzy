package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;

public class ViewFeedbackActivity extends AppCompatActivity {

    private ListView feedbackListView;

    DatabaseReference dbReference;
    String quizId, username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_feedback);

        // Find views
        TextView titleTextView = findViewById(R.id.titleTextView);
        feedbackListView = findViewById(R.id.feedbackListView);

        // Set feedback title
        titleTextView.setText("Feedback");


        // Get database reference
        dbReference = FirebaseDatabase.getInstance().getReference();

        // Get intent extras
        quizId = getIntent().getStringExtra("quizId");

        // Get username
        username = PreferenceHelper.getUsername(ViewFeedbackActivity.this);

        // Add feedback data in the ListView
        ArrayList<String> feedbackData = getFeedbackData();
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, feedbackData);
        feedbackListView.setAdapter(adapter);
    }

    private ArrayList<String> getFeedbackData() {
        ArrayList<String> feedbackData = new ArrayList<>();

        dbReference.child("History").child("host").child(username).child("quizzes")
                .child(quizId).child("feedbacks").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                for (DataSnapshot feedbackSnapshot : snapshot.getChildren()) {
                    feedbackData.add(feedbackSnapshot.child("feedback").getValue(String.class));
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

        return feedbackData;
    }
}
