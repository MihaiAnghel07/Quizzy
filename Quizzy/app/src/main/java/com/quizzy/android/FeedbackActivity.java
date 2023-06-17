package com.quizzy.android;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class FeedbackActivity extends AppCompatActivity {

    private TextView titleTextView;
    private EditText feedbackEditText;
    private ImageView star1ImageView, star2ImageView, star3ImageView, star4ImageView, star5ImageView;
    private int selectedRating = 0;

    private DatabaseReference databaseReference;

    private String quizAuthor;
    private String quizId;
    private String username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);

        // Get extras from intent
        quizAuthor = getIntent().getStringExtra("quizAuthor");
        quizId = getIntent().getStringExtra("quizId");
        username = PreferenceHelper.getUsername(FeedbackActivity.this);

        // Initialize Firebase database reference
        databaseReference = FirebaseDatabase.getInstance().getReference().child("History")
                .child("host").child(quizAuthor).child("quizzes").child(quizId);

        // Initialize views
        titleTextView = findViewById(R.id.titleTextView);
        feedbackEditText = findViewById(R.id.feedbackEditText);
        star1ImageView = findViewById(R.id.star1ImageView);
        star2ImageView = findViewById(R.id.star2ImageView);
        star3ImageView = findViewById(R.id.star3ImageView);
        star4ImageView = findViewById(R.id.star4ImageView);
        star5ImageView = findViewById(R.id.star5ImageView);

        // Set title text ("You scored X out of Y")
        String title = getIntent().getStringExtra("title");
        titleTextView.setText(title);
    }

    public void onStarClick(View view) {
        ImageView selectedStar = (ImageView) view;

        // Reset star images
        star1ImageView.setImageResource(R.drawable.ic_star_empty);
        star2ImageView.setImageResource(R.drawable.ic_star_empty);
        star3ImageView.setImageResource(R.drawable.ic_star_empty);
        star4ImageView.setImageResource(R.drawable.ic_star_empty);
        star5ImageView.setImageResource(R.drawable.ic_star_empty);

        // Get selected star position
        int selectedPosition = Integer.parseInt(selectedStar.getTag().toString());

        // Set selected rating
        selectedRating = selectedPosition;

        // Set star images up to selected position to filled star
        switch (selectedPosition) {
            case 5:
                star5ImageView.setImageResource(R.drawable.ic_star_filled);
            case 4:
                star4ImageView.setImageResource(R.drawable.ic_star_filled);
            case 3:
                star3ImageView.setImageResource(R.drawable.ic_star_filled);
            case 2:
                star2ImageView.setImageResource(R.drawable.ic_star_filled);
            case 1:
                star1ImageView.setImageResource(R.drawable.ic_star_filled);
        }
    }

    public void submitFeedback(View view) {
        // Get feedback text
        String feedback = feedbackEditText.getText().toString().trim();

        if (feedback.isEmpty()) {
            Toast.makeText(this, "Please enter your feedback", Toast.LENGTH_SHORT).show();
            return;
        }

        // Generate timestamp-based IDs for feedback and rating
        String feedbackId = String.valueOf(System.currentTimeMillis());
        String ratingId = String.valueOf(System.currentTimeMillis());

        // Create feedback data map
        Map<String, Object> feedbackData = new HashMap<>();
        feedbackData.put("feedback", feedback);

        // Create rating data map
        Map<String, Object> ratingData = new HashMap<>();
        ratingData.put("rating", selectedRating);

        // Write data to Firebase database
        databaseReference.child("feedbacks").child(feedbackId).setValue(feedbackData);
        databaseReference.child("ratings").child(ratingId).setValue(ratingData);

        Toast.makeText(this, "Feedback submitted successfully", Toast.LENGTH_SHORT).show();
        finish();
    }
}
