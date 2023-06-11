package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
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
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;

import java.lang.reflect.Array;
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
    private TextView warningTextView;

    private String lobbyCode;
    private ArrayAdapter<String> participantsAdapter;
    private List<String> participantsList;

    private DatabaseReference lobbyRef;

    String username;

    String quizAuthor, quizId, quizTitle;
    String lobbyId;

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
        warningTextView = findViewById(R.id.warningTextView);
        if (PreferenceHelper.getQuizStarted(CreateLobbyActivity.this)) {
            warningTextView.setVisibility(View.VISIBLE);
        } else {
            warningTextView.setVisibility(View.GONE);
        }

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

                // Check if there are participants in the lobby
                lobbyRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if (!snapshot.child("participants").exists()) {
                            Toast.makeText(CreateLobbyActivity.this, "There are no participants in the lobby", Toast.LENGTH_SHORT).show();
                        } else {
                            // Start the quiz
                            startQuiz();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {

                    }
                });
            }
        });

        buttonCloseLobby.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Ask user to confirm closing the lobby
                AlertDialog.Builder builder = new AlertDialog.Builder(CreateLobbyActivity.this);
                builder.setMessage("Are you sure you want to close the lobby?")
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // If user confirms, close the lobby
                                closeLobby();
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
        lobbyRef.child("code").setValue(lobbyCode);
        lobbyRef.child("duration").setValue(-1);
        lobbyRef.child("gameStatus").setValue("on hold");
        lobbyRef.child("host").setValue(username);
        lobbyRef.child("lobbyId").setValue(String.valueOf(System.currentTimeMillis()));
        lobbyRef.child("noParticipants").setValue(0);
        lobbyRef.child("participants").setValue(new ArrayList<>());
        lobbyRef.child("questionIndex").setValue(0);
        lobbyRef.child("quizAuthor").setValue("");
        lobbyRef.child("quizId").setValue(-1);
        lobbyRef.child("quizTitle").setValue("");
        lobbyRef.child("timestamp").setValue("");

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

        // Set quizStarted variable in preferences and display warning message
        PreferenceHelper.setQuizStarted(CreateLobbyActivity.this, true);
        warningTextView.setVisibility(View.VISIBLE);

        // Generate timestamp
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy, hh:mm:ss a", Locale.getDefault());
        String timestamp = dateFormat.format(new Date());


        // Get lobby ID from firebase
        lobbyRef.child("lobbyId").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                String lobbyId = snapshot.getValue(String.class);

                // Get question set data from firebase
                DatabaseReference questionSetsRef = FirebaseDatabase.getInstance().getReference("Quizzes");
                questionSetsRef.child(quizAuthor).child(quizId).addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        ArrayList<String> questionIds = new ArrayList<>();

                        ArrayList<Question> questions = new ArrayList<>();
                        for (DataSnapshot questionSnapshot : snapshot.child("Questions").getChildren()) {
                            questions.add(questionSnapshot.getValue(Question.class));
                            questionIds.add(questionSnapshot.getKey());
                        }


                        DatabaseReference historyRef = FirebaseDatabase.getInstance().getReference("History");
                        for (String participant : participantsList) {
                            // Write question set data in participant history
                            historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("quizTitle").setValue(quizTitle);
                            historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("timestamp").setValue(timestamp);

                            for (int i = 0; i < questionIds.size(); i++) {
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("hasImage").setValue(questions.get(i).isHasImage());
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("image").setValue(questions.get(i).getImage());
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("isFlagged").setValue(questions.get(i).getIsFlagged());
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("question").setValue(questions.get(i).getQuestion());

                                // Convert answer data from question set structure to history structure (isSelected field)
                                AnswerData answer1 = new AnswerData(questions.get(i).getAnswer1());
                                AnswerData answer2 = new AnswerData(questions.get(i).getAnswer2());
                                AnswerData answer3 = new AnswerData(questions.get(i).getAnswer3());
                                AnswerData answer4 = new AnswerData(questions.get(i).getAnswer4());

                                // Set answers
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("answer1").setValue(answer1);
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("answer2").setValue(answer2);
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("answer3").setValue(answer3);
                                historyRef.child("participant").child(participant).child("quizzes").child(lobbyId).child("questions")
                                        .child(questionIds.get(i)).child("answer4").setValue(answer4);

                                // Duplicate question images
                                if (questions.get(i).isHasImage()) {
                                    // Get source image
                                    String sourcePath = "/Images/" + quizAuthor + "/" + quizId +
                                            "/Questions/" + questionIds.get(i) + "/" + questions.get(i).getImage();

                                    FirebaseStorage storage = FirebaseStorage.getInstance();
                                    StorageReference sourceRef = storage.getReference().child(sourcePath);

                                    int finalI = i;
                                    sourceRef.getDownloadUrl().addOnSuccessListener(uri -> {
                                        // The image download URL is available here
                                        // String imageUrl = uri.toString();

                                        // Image retrieved successfully
                                        // Put destination image
                                        String destinationPath = "/History/participant/" +
                                                participant + "/quizzes/" + lobbyId + "/questions/" +
                                                questionIds.get(finalI) + "/" + questions.get(finalI).getImage();

                                        StorageReference destinationRef = storage.getReference().child(destinationPath);
                                        sourceRef.getBytes(Long.MAX_VALUE).addOnSuccessListener(bytes -> {
                                            destinationRef.putBytes(bytes).addOnSuccessListener(taskSnapshot -> {
                                                // Image duplication successful

                                            }).addOnFailureListener(exception -> {
                                                // Handle any errors that occurred while duplicating the image
                                            });
                                        }).addOnFailureListener(exception -> {
                                            // Handle any errors that occurred while retrieving the image bytes
                                        });
                                    }).addOnFailureListener(exception -> {
                                        // Handle any errors that occurred while retrieving the image
                                    });
                                }
                            }


                            // Write question set data in host history
                            historyRef.child("host").child(username).child("quizzes").child(lobbyId).child("quizTitle").setValue(quizTitle);
                            historyRef.child("host").child(username).child("quizzes").child(lobbyId).child("timestamp").setValue(timestamp);

                            for (int i = 0; i < questionIds.size(); i++) {
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("hasImage").setValue(questions.get(i).isHasImage());
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("image").setValue(questions.get(i).getImage());
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("isFlagged").setValue(questions.get(i).getIsFlagged());
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("question").setValue(questions.get(i).getQuestion());

                                // Convert answer data from question set structure to history structure (isSelected field)
                                AnswerData answer1 = new AnswerData(questions.get(i).getAnswer1());
                                AnswerData answer2 = new AnswerData(questions.get(i).getAnswer2());
                                AnswerData answer3 = new AnswerData(questions.get(i).getAnswer3());
                                AnswerData answer4 = new AnswerData(questions.get(i).getAnswer4());

                                // Set answers
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("answer1").setValue(answer1);
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("answer2").setValue(answer2);
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("answer3").setValue(answer3);
                                historyRef.child("host").child(username).child("quizzes").child(lobbyId).child(participant).child("questions")
                                        .child(questionIds.get(i)).child("answer4").setValue(answer4);

                                // Duplicate question images
                                if (questions.get(i).isHasImage()) {
                                    // Get source image
                                    String sourcePath = "/Images/" + quizAuthor + "/" + quizId +
                                            "/Questions/" + questionIds.get(i) + "/" + questions.get(i).getImage();

                                    FirebaseStorage storage = FirebaseStorage.getInstance();
                                    StorageReference sourceRef = storage.getReference().child(sourcePath);

                                    int finalI = i;
                                    sourceRef.getDownloadUrl().addOnSuccessListener(uri -> {
                                        // The image download URL is available here
                                        // String imageUrl = uri.toString();

                                        // Image retrieved successfully
                                        // Put destination image
                                        String destinationPath = "/History/host/" + username +
                                                "/quizzes/" + lobbyId + "/" + participant + "/questions/" +
                                                questionIds.get(finalI) + "/" + questions.get(finalI).getImage();

                                        StorageReference destinationRef = storage.getReference().child(destinationPath);
                                        sourceRef.getBytes(Long.MAX_VALUE).addOnSuccessListener(bytes -> {
                                            destinationRef.putBytes(bytes).addOnSuccessListener(taskSnapshot -> {
                                                // Image duplication successful

                                            }).addOnFailureListener(exception -> {
                                                // Handle any errors that occurred while duplicating the image
                                            });
                                        }).addOnFailureListener(exception -> {
                                            // Handle any errors that occurred while retrieving the image bytes
                                        });
                                    }).addOnFailureListener(exception -> {
                                        // Handle any errors that occurred while retrieving the image
                                    });
                                }
                            }
                        }

                        // Set lobby state data in order for participant
                        // to detect quiz start after question set data
                        // has been duplicated
                        lobbyRef.child("timestamp").setValue(timestamp);
                        lobbyRef.child("duration").setValue(editTextDuration.getText().toString());
                        lobbyRef.child("gameStatus").setValue("in progress");
                        lobbyRef.child("quizAuthor").setValue(quizAuthor);
                        lobbyRef.child("quizId").setValue(quizId);
                        lobbyRef.child("quizTitle").setValue(quizTitle);
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {

                    }
                });
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

        Toast.makeText(CreateLobbyActivity.this, "Quiz has started", Toast.LENGTH_SHORT).show();
    }

    private void closeLobby() {
        lobbyRef.removeValue();
        PreferenceHelper.setLobbyOpen(CreateLobbyActivity.this, false);
        PreferenceHelper.setActiveLobbyCode(CreateLobbyActivity.this, "");
        PreferenceHelper.setQuizStarted(CreateLobbyActivity.this, false);
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
                quizTitle = data.getStringExtra("title");
                textViewSelectedQuestionSet.setText("Selected Question Set: " + quizTitle);
            }
        }
    }
}
