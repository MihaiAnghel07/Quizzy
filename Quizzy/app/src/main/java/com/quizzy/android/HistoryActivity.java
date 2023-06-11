package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;


import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;
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
    private Spinner historyTypeSpinner;
    private String selectedHistoryType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        quizListLayout = findViewById(R.id.quizListLayout);
        historyTypeSpinner = findViewById(R.id.historyTypeSpinner);

        // Initialize spinner
        ArrayAdapter<CharSequence> spinnerAdapter = ArrayAdapter.createFromResource(this,
                R.array.history_types, android.R.layout.simple_spinner_item);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        historyTypeSpinner.setAdapter(spinnerAdapter);

        // Attach spinner listener
        historyTypeSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                System.out.println("Spinner selected");
                selectedHistoryType = parent.getItemAtPosition(position).toString();
                if (selectedHistoryType.equals("Participant")) {
                    // Load quiz list for participant
                    historyRef = FirebaseDatabase.getInstance().getReference().child("History")
                            .child("participant").child(PreferenceHelper.getUsername(HistoryActivity.this)).child("quizzes");

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
                } else {
                    // Load quiz list for host
                    historyRef = FirebaseDatabase.getInstance().getReference().child("History")
                            .child("host").child(PreferenceHelper.getUsername(HistoryActivity.this)).child("quizzes");

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
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });

        // Set the spinner selection to "All question sets"
        historyTypeSpinner.setSelection(0);
        selectedHistoryType = "Participant";
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
                if (selectedHistoryType.equals("Participant")) {
                    // Start QuizDetailsActivity (participant) with quizId as extra
                    Intent intent = new Intent(HistoryActivity.this, QuizDetailsActivity.class);
                    intent.putExtra("username", PreferenceHelper.getUsername(HistoryActivity.this));
                    intent.putExtra("quizId", quizId);
                    intent.putExtra("quizTitle", quizTitle);
                    intent.putExtra("timestamp", timestamp);
                    intent.putExtra("displayUsername", false);
                    startActivity(intent);
                } else {
                    // Start QuizDetailsActivity (host) with quizId as extra
                    Intent intent = new Intent(HistoryActivity.this, QuizDetailsHostActivity.class);
                    intent.putExtra("quizId", quizId);
                    intent.putExtra("quizTitle", quizTitle);
                    intent.putExtra("timestamp", timestamp);
                    startActivity(intent);
                }
            }
        });

        quizListLayout.addView(quizItemTextView);
    }
}
