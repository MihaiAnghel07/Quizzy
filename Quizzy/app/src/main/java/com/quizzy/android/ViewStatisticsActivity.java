package com.quizzy.android;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.net.Uri;
import android.os.Bundle;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;


import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.quizzy.android.DataStructures.Answer;
import com.quizzy.android.DataStructures.Question;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ViewStatisticsActivity extends AppCompatActivity {

    private BarChart scoreChart;
    private LinearLayout questionChartsContainer;


    private int participantCount = 10;
    private int questionCount = 15;
    private int answerCount = 4;

    boolean doneLoading;

    DatabaseReference dbReference;

    private String quizId;
    private String username;

    int scoreSum, scoreCount, questionsCount;

    ArrayList<String> questionIds;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_statistics);

        // Find views
        scoreChart = findViewById(R.id.scoreChart);
        questionChartsContainer = findViewById(R.id.questionChartsContainer);

        // Get database reference
        dbReference = FirebaseDatabase.getInstance().getReference();

        // Get quiz Id
        quizId = getIntent().getStringExtra("quizId");

        // Get username
        username = PreferenceHelper.getUsername(ViewStatisticsActivity.this);

        // Init variables
        doneLoading = false;
        scoreCount = 0;
        scoreSum = 0;
        questionsCount = 0;


        //computeStatistics();
        questionIds = new ArrayList<>();



        computeStatistics();
    }




    private void computeStatistics() {
        dbReference.child("History").child("host").child(username).child("quizzes")
                .child(quizId).addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        for (DataSnapshot participantSnapshot : snapshot.getChildren()) {
                            if (!participantSnapshot.getKey().equals("timestamp") && !participantSnapshot.getKey().equals("quizTitle")
                            && !participantSnapshot.getKey().equals("feedbacks") && !participantSnapshot.getKey().equals("ratings")) {
                                for (DataSnapshot questionSnapshot : participantSnapshot.child("questions").getChildren()) {
                                    // Get question ids
                                    questionIds.add(questionSnapshot.getKey());
                                }

                                break;
                            }
                        }

                        // Init score distribution
                        ArrayList<Integer> scoreDistribution = new ArrayList<>(questionIds.size());
                        for (int i = 0; i < questionIds.size() + 1; i++) {
                            scoreDistribution.add(0);
                        }

                        // Compute score distribution
                        for (DataSnapshot participantSnapshot : snapshot.getChildren()) {
                            int score = 0;
                            if (!participantSnapshot.getKey().equals("timestamp") && !participantSnapshot.getKey().equals("quizTitle")
                                    && !participantSnapshot.getKey().equals("feedbacks") && !participantSnapshot.getKey().equals("ratings")) {
                                for (DataSnapshot questionSnapshot : participantSnapshot.child("questions").getChildren()) {
                                    AnswerData answer1 = new AnswerData();
                                    AnswerData answer2 = new AnswerData();
                                    AnswerData answer3 = new AnswerData();
                                    AnswerData answer4 = new AnswerData();

                                    answer1.setCorrect(questionSnapshot.child("answer1")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer1.setSelected(questionSnapshot.child("answer1")
                                            .child("isSelected").getValue(Boolean.class));

                                    answer2.setCorrect(questionSnapshot.child("answer2")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer2.setSelected(questionSnapshot.child("answer2")
                                            .child("isSelected").getValue(Boolean.class));

                                    answer3.setCorrect(questionSnapshot.child("answer3")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer3.setSelected(questionSnapshot.child("answer3")
                                            .child("isSelected").getValue(Boolean.class));

                                    answer4.setCorrect(questionSnapshot.child("answer4")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer4.setSelected(questionSnapshot.child("answer4")
                                            .child("isSelected").getValue(Boolean.class));

                                    if (    (answer1.isCorrect() && answer1.isSelected()) ||
                                            (answer2.isCorrect() && answer2.isSelected()) ||
                                            (answer3.isCorrect() && answer3.isSelected()) ||
                                            (answer4.isCorrect() && answer4.isSelected())) {
                                        score++;

                                    }
                                }

                                scoreDistribution.set(score, scoreDistribution.get(score) + 1);
                            }
                        }

                        // Display score distribution chart
                        displayScoreDistribution(scoreDistribution);



                        // Compute question answer distribution
                        int questionIndex = 0;
                        for (String questionId : questionIds) {
                            boolean currentQuestionFlagged = false;
                            questionIndex++;
                            Question question = new Question();
                            String questionText, ans1, ans2, ans3, ans4;
                            int correctIndex = 0;
                            ArrayList<Integer> answerDistribution = new ArrayList<>(4);
                            for (int i = 0; i < 4; i++) {
                                answerDistribution.add(0);
                            }

                            for (DataSnapshot participantSnapshot : snapshot.getChildren()) {
                                if (!participantSnapshot.getKey().equals("timestamp") && !participantSnapshot.getKey().equals("quizTitle")
                                        && !participantSnapshot.getKey().equals("feedbacks") && !participantSnapshot.getKey().equals("ratings")) {
                                    // Get question data
                                    DataSnapshot questionSnapshot = participantSnapshot.child("questions").child(questionId);
                                    AnswerData answer1 = new AnswerData();
                                    AnswerData answer2 = new AnswerData();
                                    AnswerData answer3 = new AnswerData();
                                    AnswerData answer4 = new AnswerData();

                                    // Question question = new Question();
                                    question.setQuestion(questionSnapshot.child("question").getValue(String.class));
                                    question.setIsFlagged(questionSnapshot.child("isFlagged").getValue(Boolean.class));
                                    question.setImage(questionSnapshot.child("image").getValue(String.class));
                                    question.setHasImage(questionSnapshot.child("hasImage").getValue(Boolean.class));
                                    question.setAnswer1(new Answer(questionSnapshot.child("answer1")
                                            .child("isCorrect").getValue(Boolean.class),
                                            questionSnapshot.child("answer1")
                                                    .child("text").getValue(String.class)));
                                    question.setAnswer2(new Answer(questionSnapshot.child("answer2")
                                            .child("isCorrect").getValue(Boolean.class),
                                            questionSnapshot.child("answer2")
                                                    .child("text").getValue(String.class)));
                                    question.setAnswer3(new Answer(questionSnapshot.child("answer3")
                                            .child("isCorrect").getValue(Boolean.class),
                                            questionSnapshot.child("answer3")
                                                    .child("text").getValue(String.class)));
                                    question.setAnswer4(new Answer(questionSnapshot.child("answer4")
                                            .child("isCorrect").getValue(Boolean.class),
                                            questionSnapshot.child("answer4")
                                                    .child("text").getValue(String.class)));
                                    questionText = question.getQuestion();

                                    answer1.setCorrect(questionSnapshot.child("answer1")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer1.setSelected(questionSnapshot.child("answer1")
                                            .child("isSelected").getValue(Boolean.class));
                                    answer1.setText(questionSnapshot.child("answer1")
                                            .child("text").getValue(String.class));

                                    answer2.setCorrect(questionSnapshot.child("answer2")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer2.setSelected(questionSnapshot.child("answer2")
                                            .child("isSelected").getValue(Boolean.class));
                                    answer2.setText(questionSnapshot.child("answer2")
                                            .child("text").getValue(String.class));

                                    answer3.setCorrect(questionSnapshot.child("answer3")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer3.setSelected(questionSnapshot.child("answer3")
                                            .child("isSelected").getValue(Boolean.class));
                                    answer3.setText(questionSnapshot.child("answer3")
                                            .child("text").getValue(String.class));

                                    answer4.setCorrect(questionSnapshot.child("answer4")
                                            .child("isCorrect").getValue(Boolean.class));
                                    answer4.setSelected(questionSnapshot.child("answer4")
                                            .child("isSelected").getValue(Boolean.class));
                                    answer4.setText(questionSnapshot.child("answer4")
                                            .child("text").getValue(String.class));

                                    ans1 = answer1.getText();
                                    ans2 = answer2.getText();
                                    ans3 = answer3.getText();
                                    ans4 = answer4.getText();

                                    if (answer1.isCorrect()) {
                                        correctIndex = 0;
                                    } else if (answer2.isCorrect()) {
                                        correctIndex = 1;
                                    } else if (answer3.isCorrect()) {
                                        correctIndex = 2;
                                    } else if (answer4.isCorrect()) {
                                        correctIndex = 3;
                                    }

                                    if (answer1.isSelected()) {
                                        answerDistribution.set(0, answerDistribution.get(0) + 1);
                                    } else if (answer2.isSelected()) {
                                        answerDistribution.set(1, answerDistribution.get(1) + 1);
                                    } else if (answer3.isSelected()) {
                                        answerDistribution.set(2, answerDistribution.get(2) + 1);
                                    } else if (answer4.isSelected()) {
                                        answerDistribution.set(3, answerDistribution.get(3) + 1);
                                    }

                                    if (question.getIsFlagged()) {
                                        currentQuestionFlagged = true;
                                    }
                                }
                            }

                            // Display question (text + answers + image?)
                            displayQuestion(question, questionIndex, currentQuestionFlagged);

                            // Display answer distribution chart for question
                            displayAnswerDistributionForQuestion(answerDistribution, correctIndex);
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {

                    }
                });
    }


    private void displayQuestion(Question question, int questionIndex, boolean flagged) {
        String questionText = String.valueOf(questionIndex) + ". " + question.getQuestion();

        LinearLayout questionLayout = new LinearLayout(ViewStatisticsActivity.this);
        questionLayout.setOrientation(LinearLayout.VERTICAL);

        // Add flag icon if the current question has been flagged by a participant
        if (flagged) {
            ImageView flagImageView = new ImageView(ViewStatisticsActivity.this);
            flagImageView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            flagImageView.setScaleType(ImageView.ScaleType.CENTER_INSIDE);

            int imageResourceId = R.drawable.ic_flag;
            flagImageView.setImageResource(imageResourceId);

            questionLayout.addView(flagImageView);
        }


        // Add question text to view
        TextView questionTextView = new TextView(ViewStatisticsActivity.this);
        questionTextView.setText(questionText);
        questionTextView.setTextSize(18);
        questionTextView.setTextColor(Color.BLACK);
        questionTextView.setPadding(0, 0, 0, 8);
        questionLayout.addView(questionTextView);


        // Add answer1 text to view
        TextView answer1TextView = new TextView(ViewStatisticsActivity.this);
        answer1TextView.setGravity(Gravity.CENTER_VERTICAL);
        answer1TextView.setText("Ans1. " + question.getAnswer1().getText());
        answer1TextView.setTextSize(16);
        answer1TextView.setTextColor(Color.BLACK);
        answer1TextView.setCompoundDrawablePadding(8);

        if (question.getAnswer1().getIsCorrect()) {
            answer1TextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_mark2, 0);
            answer1TextView.setTextColor(Color.GREEN);
        }
        questionLayout.addView(answer1TextView);

        // Add answer2 text to view
        TextView answer2TextView = new TextView(ViewStatisticsActivity.this);
        answer2TextView.setGravity(Gravity.CENTER_VERTICAL);
        answer2TextView.setText("Ans2. " + question.getAnswer2().getText());
        answer2TextView.setTextSize(16);
        answer2TextView.setTextColor(Color.BLACK);
        answer2TextView.setCompoundDrawablePadding(8);

        if (question.getAnswer2().getIsCorrect()) {
            answer2TextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_mark2, 0);
            answer2TextView.setTextColor(Color.GREEN);
        }
        questionLayout.addView(answer2TextView);

        // Add answer3 text to view
        TextView answer3TextView = new TextView(ViewStatisticsActivity.this);
        answer3TextView.setGravity(Gravity.CENTER_VERTICAL);
        answer3TextView.setText("Ans3. " + question.getAnswer3().getText());
        answer3TextView.setTextSize(16);
        answer3TextView.setTextColor(Color.BLACK);
        answer3TextView.setCompoundDrawablePadding(8);

        if (question.getAnswer3().getIsCorrect()) {
            answer3TextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_mark2, 0);
            answer3TextView.setTextColor(Color.GREEN);
        }
        questionLayout.addView(answer3TextView);

        // Add answer4 text to view
        TextView answer4TextView = new TextView(ViewStatisticsActivity.this);
        answer4TextView.setGravity(Gravity.CENTER_VERTICAL);
        answer4TextView.setText("Ans4. " + question.getAnswer4().getText());
        answer4TextView.setTextSize(16);
        answer4TextView.setTextColor(Color.BLACK);
        answer4TextView.setCompoundDrawablePadding(8);

        if (question.getAnswer4().getIsCorrect()) {
            answer4TextView.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_mark2, 0);
            answer4TextView.setTextColor(Color.GREEN);
        }
        questionLayout.addView(answer4TextView);


        // TODO: Add image to view
        FirebaseStorage storage = FirebaseStorage.getInstance();
        StorageReference storageRef = storage.getReference();
        // Add question image
        if (question.isHasImage()) {
            ImageView questionImageView = new ImageView(ViewStatisticsActivity.this);
            String imageName = question.getImage();
            String imagePath = "History/participant/" + username + "/quizzes/" + quizId + "/questions/" + questionIds.get(questionIndex - 1) + "/" + imageName;
            //String imagePath = "/History/participant/user3/quizzes/1685717718679/questions/0/1200px-Un1.svg.png";
            StorageReference imageRef = storageRef.child(imagePath);
            imageRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                @Override
                public void onSuccess(Uri uri) {
                    // Load the image using Picasso
                    Picasso.get().load(uri).into(questionImageView);
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception exception) {
                    // Handle any errors that occur during image retrieval
                }
            });
            questionLayout.addView(questionImageView);
        }

        questionChartsContainer.addView(questionLayout);
    }

    // Custom BarDataSet class to handle different colors for bars
    class CustomBarDataSet extends BarDataSet {
        private int targetIndex;
        private int customColor;

        public CustomBarDataSet(List<BarEntry> yVals, String label) {
            super(yVals, label);
        }

        public void setTargetIndex(int targetIndex) {
            this.targetIndex = targetIndex;
        }

        public void setCustomColor(int customColor) {
            this.customColor = customColor;
        }

        @Override
        public int getEntryCount() {
            return super.getEntryCount();
        }

        @Override
        public int getColor(int index) {
            if (index == targetIndex) {
                return customColor;
            }
            return super.getColor(index);
        }
    }


    private void displayScoreDistribution(ArrayList<Integer> scoreDistribution) {
        List<BarEntry> entries = getScoreEntries(scoreDistribution);
        BarDataSet dataSet = new BarDataSet(entries, "Score Distribution");
        dataSet.setColor(Color.BLUE);

        BarData barData = new BarData(dataSet);
        scoreChart.setData(barData);
        scoreChart.setFitBars(true);
        scoreChart.getDescription().setEnabled(false);
        scoreChart.animateY(1000);
        scoreChart.invalidate();
    }

    private void displayAnswerDistributionForQuestion(ArrayList<Integer> answerDistribution, int correctIndex) {
        List<BarEntry> entries = getAnswerEntriesForQuestion(answerDistribution);
        BarDataSet dataSet = new BarDataSet(entries, "Question Answer Distribution");
        dataSet.setColor(Color.BLUE);

        BarData barData = new BarData(dataSet);

        BarChart chart = new BarChart(this);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                300
        );
        layoutParams.setMargins(0, 16, 0, 0);
        chart.setLayoutParams(layoutParams);
        chart.setData(barData);
        chart.setFitBars(true);
        chart.getDescription().setEnabled(false);
        chart.animateY(1000);
        chart.invalidate();

        questionChartsContainer.addView(chart);
    }

    private List<BarEntry> getScoreEntries(ArrayList<Integer> scoreDistribution) {
        List<BarEntry> entries = new ArrayList<>();

        for (int i = 0; i < scoreDistribution.size(); i++) {
            entries.add(new BarEntry(i, scoreDistribution.get(i)));
        }

        return entries;
    }

    private List<BarEntry> getAnswerEntriesForQuestion(ArrayList<Integer> answerDistribution) {
        List<BarEntry> entries = new ArrayList<>();

        for (int i = 0; i < answerDistribution.size(); i++) {
            entries.add(new BarEntry(i, answerDistribution.get(i)));
        }

        return entries;
    }
}
