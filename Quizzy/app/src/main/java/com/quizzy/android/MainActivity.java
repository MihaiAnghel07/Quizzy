package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Check login status
        boolean isLoggedIn = PreferenceHelper.getLoginStatus(this);

        if (isLoggedIn) {
            // User is logged in, redirect to HomeActivity or any other desired activity
            Intent intent = new Intent(MainActivity.this, HomeActivity.class);
            startActivity(intent);
            finish(); // Optional: Finish the MainActivity so that it's not in the back stack
        } else {
            setContentView(R.layout.activity_main);

            Button loginButton = findViewById(R.id.login_button);
            Button signupButton = findViewById(R.id.signup_button);

            loginButton.setOnClickListener(v -> {
                // Open the LoginActivity
                Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                startActivity(intent);
            });

            signupButton.setOnClickListener(v -> {
                // Open the SignUpActivity
                Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
                startActivity(intent);
            });
        }


    }
    @Override
    protected void onResume() {
        super.onResume();
        boolean isLoggedIn = PreferenceHelper.getLoginStatus(this);

        if (isLoggedIn) {
            Intent intent = new Intent(MainActivity.this, HomeActivity.class);
            startActivity(intent);
            finish();
        }
    }
}