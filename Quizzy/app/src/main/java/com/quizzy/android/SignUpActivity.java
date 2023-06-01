package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;


import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserProfileChangeRequest;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;


import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Transaction;
import com.google.firebase.database.MutableData;
import com.google.firebase.database.ValueEventListener;
import androidx.annotation.Nullable;

public class SignUpActivity extends AppCompatActivity {

    private EditText usernameEditText, emailEditText, passwordEditText;
    private Button signUpButton;
    private FirebaseAuth firebaseAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        firebaseAuth = FirebaseAuth.getInstance();

        usernameEditText = findViewById(R.id.username_edittext);
        emailEditText = findViewById(R.id.email_edittext);
        passwordEditText = findViewById(R.id.password_edittext);
        signUpButton = findViewById(R.id.signup_button);

        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signUp();
            }
        });
    }

    private void signUp() {
        final String username = usernameEditText.getText().toString().trim();
        final String email = emailEditText.getText().toString().trim();
        final String password = passwordEditText.getText().toString().trim();

        if (TextUtils.isEmpty(username)) {
            Toast.makeText(this, "Please enter a username", Toast.LENGTH_SHORT).show();
            return;
        }

        if (TextUtils.isEmpty(email)) {
            Toast.makeText(this, "Please enter an email", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!isEmailValid(email)) {
            Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show();
            return;
        }

        if (TextUtils.isEmpty(password)) {
            Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show();
            return;
        }

        if (password.length() < 6) {
            Toast.makeText(this, "Password must be at least 6 characters long", Toast.LENGTH_SHORT).show();
            return;
        }

        // Check if username already exists
        DatabaseReference usersRef = FirebaseDatabase.getInstance().getReference("Users");
        usersRef.orderByChild("username").equalTo(username).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    // Username already exists
                    Toast.makeText(SignUpActivity.this, "Username already exists, please choose a different one", Toast.LENGTH_SHORT).show();
                } else {
                    // Create a new user in Firebase Authentication
                    firebaseAuth.createUserWithEmailAndPassword(email, password)
                            .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                                @Override
                                public void onComplete(@NonNull Task<AuthResult> task) {
                                    if (task.isSuccessful()) {
                                        // Registration successful
                                        String userId = firebaseAuth.getCurrentUser().getUid();

                                        // Store user data in the Realtime Database
                                        User user = new User(username, email);
                                        usersRef.child(userId).setValue(user);

                                        // Increment the "noUsers" field
                                        DatabaseReference noUsersRef = FirebaseDatabase.getInstance().getReference("Users").child("noUsers");
                                        noUsersRef.runTransaction(new Transaction.Handler() {
                                            @NonNull
                                            @Override
                                            public Transaction.Result doTransaction(@NonNull MutableData mutableData) {
                                                Integer currentValue = mutableData.getValue(Integer.class);
                                                if (currentValue == null) {
                                                    // If the "noUsers" field doesn't exist, set it to 1
                                                    mutableData.setValue(1);
                                                } else {
                                                    // Increment the value by 1
                                                    mutableData.setValue(currentValue + 1);
                                                }
                                                return Transaction.success(mutableData);
                                            }

                                            @Override
                                            public void onComplete(@Nullable DatabaseError databaseError, boolean committed, @Nullable DataSnapshot dataSnapshot) {
                                                if (committed) {
                                                    Toast.makeText(SignUpActivity.this, "Sign up successful", Toast.LENGTH_SHORT).show();
                                                    // TODO: Add any additional actions or navigation logic after successful sign up
                                                    finish();
                                                } else {
                                                    String errorMessage = databaseError != null ? databaseError.getMessage() : "Unknown error";
                                                    Toast.makeText(SignUpActivity.this, "Failed to increment users count: " + errorMessage, Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                                    } else {
                                        // Registration failed, display error message
                                        String errorMessage = task.getException().getMessage();
                                        Toast.makeText(SignUpActivity.this, "Sign up failed: " + errorMessage, Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                String errorMessage = databaseError.getMessage();
                Toast.makeText(SignUpActivity.this, "Error: " + errorMessage, Toast.LENGTH_SHORT).show();
            }
        });
    }



    private boolean isEmailValid(String email) {
        // Add your email validation logic here, e.g., using a regular expression or library
        // For simplicity, we'll use a basic email pattern matching
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }
}
