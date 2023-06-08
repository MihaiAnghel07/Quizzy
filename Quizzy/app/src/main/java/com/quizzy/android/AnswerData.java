package com.quizzy.android;

import com.google.firebase.database.IgnoreExtraProperties;
import com.google.firebase.database.PropertyName;
import com.quizzy.android.DataStructures.Answer;

@IgnoreExtraProperties
public class AnswerData {
    @PropertyName("isCorrect")
    private Boolean isCorrect;
    @PropertyName("isSelected")
    private Boolean isSelected;
    private String text;


    // Constructor for Answer class
    public AnswerData() {
        // Required empty constructor for Firebase
    }

    public AnswerData(Boolean isCorrect, Boolean isSelected, String text) {
        this.isCorrect = isCorrect;
        this.isSelected = isSelected;
        this.text = text;
    }

    public AnswerData(Answer ans) {
        this.isCorrect = ans.getIsCorrect();
        this.text = ans.getText();
        this.isSelected = false;
    }


    @PropertyName("isCorrect")
    public Boolean isCorrect() {
        return isCorrect;
    }

    @PropertyName("isCorrect")
    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }

    @PropertyName("isSelected")
    public Boolean isSelected() {
        return isSelected;
    }

    @PropertyName("isSelected")
    public void setSelected(Boolean selected) {
        isSelected = selected;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
