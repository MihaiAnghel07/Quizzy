package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class JoinLobbyActivity extends AppCompatActivity {

    private EditText lobbyCodeEditText;
    private Button joinLobbyButton;

    private DatabaseReference lobbiesRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_join_lobby);

        lobbyCodeEditText = findViewById(R.id.lobbyCodeEditText);
        joinLobbyButton = findViewById(R.id.joinLobbyButton);

        lobbiesRef = FirebaseDatabase.getInstance().getReference().child("Lobbies");

        joinLobbyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String lobbyCode = lobbyCodeEditText.getText().toString().trim();
                if (TextUtils.isEmpty(lobbyCode)) {
                    Toast.makeText(JoinLobbyActivity.this, "Please enter a lobby code", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Check if the lobby code is in the correct format (4 digits)
                if (lobbyCode.length() != 4 || !lobbyCode.matches("\\d+")) {
                    Toast.makeText(JoinLobbyActivity.this, "Invalid lobby code format", Toast.LENGTH_SHORT).show();
                    return;
                }

                joinLobby(lobbyCode);
            }
        });
    }

    private void joinLobby(String lobbyCode) {
        // Check if the lobby exists in the database
        lobbiesRef.child(lobbyCode).get().addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                if (task.getResult().exists()) {
                    // Lobby exists, check if participant is already in the lobby
                    String username = PreferenceHelper.getUsername(this);

                    boolean participantAlreadyInLobby = false;

                    for (DataSnapshot participantSnapshot : task.getResult().child("participants").getChildren()) {
                        String participantName = participantSnapshot.child("name").getValue(String.class);
                        if (participantName != null && participantName.equals(username)) {
                            participantAlreadyInLobby = true;
                            break;
                        }
                    }

                    if (participantAlreadyInLobby) {
                        Toast.makeText(JoinLobbyActivity.this, "You are already in the lobby", Toast.LENGTH_SHORT).show();
                    } else {
                        String gameStatus = task.getResult().child("gameStatus").getValue(String.class);

                        if (gameStatus != null && gameStatus.equals("in progress")) {
                            Toast.makeText(JoinLobbyActivity.this, "The quiz has already started", Toast.LENGTH_SHORT).show();
                        } else {
                            // Lobby exists, update participants and noParticipants
                            int participantIndex = task.getResult().child("noParticipants").getValue(Integer.class);

                            // Update the lobby participants with username and score
                            DatabaseReference participantsRef = lobbiesRef.child(lobbyCode)
                                    .child("participants")
                                    .child(String.valueOf(participantIndex));

                            participantsRef.child("name").setValue(username);
                            participantsRef.child("score").setValue(0);

                            // Increment the number of participants in the lobby
                            lobbiesRef.child(lobbyCode).child("noParticipants").setValue(participantIndex + 1);

                            // Start the lobby activity
                            Intent intent = new Intent(JoinLobbyActivity.this, LobbyActivity.class);
                            intent.putExtra("lobbyCode", lobbyCode);
                            startActivity(intent);
                            finish();
                        }
                    }
                } else {
                    Toast.makeText(JoinLobbyActivity.this, "Lobby does not exist", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(JoinLobbyActivity.this, "Failed to join lobby", Toast.LENGTH_SHORT).show();
            }
        });
    }

}
