package com.quizzy.android;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class HomeActivity extends AppCompatActivity {
    private static final String PREF_NAME = "MyPreferences";
    private TextView greetingTextView, usernameTextView;
    private Button joinLobbyButton, historyButton, logoutButton, questionSetsButton, createLobbyButton;

    private SharedPreferences sharedPreferences;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        greetingTextView = findViewById(R.id.greetingTextView);
        usernameTextView = findViewById(R.id.usernameTextView);
        joinLobbyButton = findViewById(R.id.joinLobbyButton);
        createLobbyButton = findViewById(R.id.createLobbyButton);
        historyButton = findViewById(R.id.historyButton);
        logoutButton = findViewById(R.id.logout_button);
        questionSetsButton = findViewById(R.id.questionSetsButton);

        sharedPreferences = getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        Intent intent = getIntent();
        if (intent != null && intent.hasExtra("username")) {
            String username = intent.getStringExtra("username");

            // Set login status after successful login
            PreferenceHelper.setLoginStatus(this, true);
            PreferenceHelper.setUsername(this, username);
        }

        // Retrieve the username from SharedPreferences
        String username = PreferenceHelper.getUsername(this);
        usernameTextView.setText(username);


        // Set the button click listeners
        joinLobbyButton.setOnClickListener(v -> {
            // Start Join Lobby activity
            Intent newIntent = new Intent(HomeActivity.this, JoinLobbyActivity.class);
            startActivity(newIntent);
        });

        createLobbyButton.setOnClickListener(v -> {
            // Start Join Lobby activity
            Intent newIntent = new Intent(HomeActivity.this, CreateLobbyActivity.class);
            startActivity(newIntent);
        });

        historyButton.setOnClickListener(v -> {
            // Start History activity
            Intent newIntent = new Intent(HomeActivity.this, HistoryActivity.class);
            startActivity(newIntent);
        });

        logoutButton.setOnClickListener(v -> {
            // Display confirmation dialog
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setMessage("Are you sure you want to log out?")
                    .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            // If the user confirms, log out
                            // Clear the username and login status in SharedPreferences
                            PreferenceHelper.setLoginStatus(HomeActivity.this, false);
                            PreferenceHelper.setUsername(HomeActivity.this, "USER_NONE");

                            // Display logout message
                            Toast.makeText(HomeActivity.this, "Logged out successfully", Toast.LENGTH_SHORT).show();

                            // Start the main activity
                            Intent newIntent = new Intent(HomeActivity.this, MainActivity.class);
                            startActivity(newIntent);
                            finish();
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
        });

        questionSetsButton.setOnClickListener(v -> {
            // Start History activity
            Intent newIntent = new Intent(HomeActivity.this, QuestionSetsActivity.class);
            startActivity(newIntent);
        });

    }
}