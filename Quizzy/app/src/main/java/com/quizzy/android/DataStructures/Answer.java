package com.quizzy.android.DataStructures;

public class Answer {
    private boolean isCorrect;
    private String text;

    public Answer() {
    }

    public Answer(boolean isCorrect, String text) {
        this.isCorrect = isCorrect;
        this.text = text;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}

