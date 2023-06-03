package com.quizzy.android;

public class AnswerData {
    private Boolean isCorrect;
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



    public Boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Boolean isSelected() {
        return isSelected;
    }

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
