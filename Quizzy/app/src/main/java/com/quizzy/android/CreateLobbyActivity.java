package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.quizzy.android.DataStructures.QuestionSet;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Random;

public class CreateLobbyActivity extends AppCompatActivity {

    private static final String TAG = "CreateLobbyActivity";

    private TextView textViewLobbyCode;
    private TextView textViewSelectedQuestionSet;
    private Button buttonSelectQuestionSet;
    private EditText editTextDuration;
    private Button buttonStartQuiz;
    private Button buttonCloseLobby;
    private ListView listViewParticipants;

    private String lobbyCode;
    private ArrayAdapter<String> participantsAdapter;
    private List<String> participantsList;

    private DatabaseReference lobbyRef;

    String username;

    String quizAuthor, quizId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_lobby);

        textViewLobbyCode = findViewById(R.id.textViewLobbyCode);
        textViewSelectedQuestionSet = findViewById(R.id.textViewSelectedQuestionSet);
        buttonSelectQuestionSet = findViewById(R.id.buttonSelectQuestionSet);
        editTextDuration = findViewById(R.id.editTextDuration);
        buttonStartQuiz = findViewById(R.id.buttonStartQuiz);
        buttonCloseLobby = findViewById(R.id.buttonCloseLobby);
        listViewParticipants = findViewById(R.id.listViewParticipants);

        participantsList = new ArrayList<>();
        participantsAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, participantsList);
        listViewParticipants.setAdapter(participantsAdapter);


        textViewSelectedQuestionSet.setText("No Question Set Selected");

        // Get username
        username = PreferenceHelper.getUsername(CreateLobbyActivity.this);


        // Check if the user already has an open lobby and get lobbyCode or generate new one
        if (PreferenceHelper.getLobbyOpen(CreateLobbyActivity.this)) {
            lobbyCode = PreferenceHelper.getActiveLobbyCode(CreateLobbyActivity.this);

            DatabaseReference lobbiesRef = FirebaseDatabase.getInstance().getReference("Lobbies");
            lobbyRef = lobbiesRef.child(lobbyCode);
            // Display the lobby code
            textViewLobbyCode.setText("Lobby Code: " + lobbyCode);

            // Listen for changes in the participants list
            lobbyRef.child("participants").addValueEventListener(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    participantsList.clear();
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        String name = snapshot.child("name").getValue(String.class);
                        participantsList.add(name);
                    }
                    participantsAdapter.notifyDataSetChanged();
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    Log.e(TAG, "onCancelled: Failed to retrieve participants", databaseError.toException());
                }
            });
        } else {
            lobbyCode = generateLobbyCode();

            // Check if lobby code already exists in the database
            DatabaseReference lobbiesRef = FirebaseDatabase.getInstance().getReference("Lobbies");
            lobbyRef = lobbiesRef.child(lobbyCode);
            lobbyRef.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    if (dataSnapshot.exists()) {
                        // Lobby code already exists, generate a new one
                        lobbyCode = generateLobbyCode();
                        lobbyRef = lobbiesRef.child(lobbyCode);
                    }

                    // Create lobby entry in the database
                    createLobbyEntry();

                    // Display the lobby code
                    textViewLobbyCode.setText("Lobby Code: " + lobbyCode);
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    Log.e(TAG, "onCancelled: Failed to check lobby code existence", databaseError.toException());
                }
            });
        }





        buttonSelectQuestionSet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Start a new activity to select question set
                Intent intent = new Intent(CreateLobbyActivity.this, SelectQuestionSetActivity.class);
                startActivityForResult(intent, 1);
            }
        });

        buttonStartQuiz.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Check if duration is valid
                String durationString = editTextDuration.getText().toString();
                System.out.println(editTextDuration.getText().toString());
                if (durationString.equals("")) {
                    Toast.makeText(CreateLobbyActivity.this, "Enter a quiz duration between 0-60 minutes", Toast.LENGTH_SHORT).show();
                    return;
                }
                else if (!(Integer.parseInt(editTextDuration.getText().toString()) > 0 &&
                        Integer.parseInt(editTextDuration.getText().toString()) <= 60)) {
                    Toast.makeText(CreateLobbyActivity.this, "Enter a quiz duration between 0-60 minutes", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Check if a question set has been selected
                if (quizAuthor == null || quizId == null) {
                    Toast.makeText(CreateLobbyActivity.this, "Please select a question set", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Start the quiz
                startQuiz();
            }
        });

        buttonCloseLobby.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Close the lobby
                closeLobby();
            }
        });
    }

    private String generateLobbyCode() {
        Random random = new Random();
        int lobbyCodeNumber = random.nextInt(9000) + 1000;
        PreferenceHelper.setLobbyOpen(CreateLobbyActivity.this, true);
        PreferenceHelper.setActiveLobbyCode(CreateLobbyActivity.this, String.valueOf(lobbyCodeNumber));
        return String.valueOf(lobbyCodeNumber);
    }

    private void createLobbyEntry() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy, hh:mm:ss a", Locale.getDefault());
        String timestamp = dateFormat.format(new Date());

        lobbyRef.child("code").setValue(lobbyCode);
        lobbyRef.child("duration").setValue(-1);
        lobbyRef.child("gameStatus").setValue("on hold");
        lobbyRef.child("host").setValue(username);
        lobbyRef.child("lobbyId").setValue(System.currentTimeMillis());
        lobbyRef.child("noParticipants").setValue(0);
        lobbyRef.child("participants").setValue(new ArrayList<>());
        lobbyRef.child("questionIndex").setValue(0);
        lobbyRef.child("quizAuthor").setValue("");
        lobbyRef.child("quizId").setValue("");
        lobbyRef.child("quizTitle").setValue("");
        lobbyRef.child("timestamp").setValue(timestamp);

        // Listen for changes in the participants list
        lobbyRef.child("participants").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                participantsList.clear();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    String name = snapshot.child("name").getValue(String.class);
                    participantsList.add(name);
                }
                participantsAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e(TAG, "onCancelled: Failed to retrieve participants", databaseError.toException());
            }
        });
    }

    private void startQuiz() {
        // TODO: Implement quiz start logic

    }

    private void closeLobby() {
        lobbyRef.removeValue();
        PreferenceHelper.setLobbyOpen(CreateLobbyActivity.this, false);
        PreferenceHelper.setActiveLobbyCode(CreateLobbyActivity.this, "");
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == RESULT_OK) {
            if (data != null) {
                // Set the question set author and Id receiver from question set selection activity
                quizAuthor = data.getStringExtra("quizAuthor");
                quizId = data.getStringExtra("quizId");
                String title = data.getStringExtra("title");
                textViewSelectedQuestionSet.setText("Selected Question Set: " + title);
            }
        }
    }
}
