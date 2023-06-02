package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.content.Intent;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;


import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class LobbyActivity extends AppCompatActivity {

    private ProgressBar loadingProgressBar;
    private TextView waitingTextView;

    private DatabaseReference lobbyRef;
    private ValueEventListener gameStatusListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lobby);

        loadingProgressBar = findViewById(R.id.loadingProgressBar);
        waitingTextView = findViewById(R.id.waitingTextView);

        // Get the lobby code from the intent extra
        String lobbyCode = getIntent().getStringExtra("lobbyCode");

        // Get the reference to the lobby in the Firebase Realtime Database
        lobbyRef = FirebaseDatabase.getInstance().getReference().child("Lobbies").child(lobbyCode);

        // Set up a listener to detect changes in the game status
        gameStatusListener = new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                String gameStatus = dataSnapshot.getValue(String.class);
                if (gameStatus != null && gameStatus.equals("in progress")) {
                    // Game has started, start the quiz activity
                    startQuizActivity();
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error, if needed
            }
        };

        // Add the game status listener to the lobby reference
        lobbyRef.child("gameStatus").addValueEventListener(gameStatusListener);
    }

    @Override
    public void onBackPressed() {
        Toast.makeText(LobbyActivity.this, "You have left the lobby", Toast.LENGTH_SHORT).show();
        // Remove the game status listener when the activity is destroyed
        if (lobbyRef != null && gameStatusListener != null) {
            lobbyRef.child("gameStatus").removeEventListener(gameStatusListener);
        }

        // Remove the participant from the lobby
        String username = PreferenceHelper.getUsername(this);
        lobbyRef.child("participants").orderByChild("name").equalTo(username).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot participantSnapshot : dataSnapshot.getChildren()) {
                    participantSnapshot.getRef().removeValue();
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error, if needed
            }
        });

        // Decrement the number of participants in the lobby
        lobbyRef.child("noParticipants").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer noParticipants = dataSnapshot.getValue(Integer.class);
                if (noParticipants != null) {
                    lobbyRef.child("noParticipants").setValue(noParticipants - 1);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle database error, if needed
            }
        });

        super.onBackPressed();
    }


    private void startQuizActivity() {
        // Start the quiz activity
        Intent intent = new Intent(LobbyActivity.this, QuizActivity.class);
        startActivity(intent);
        finish();
    }
}
