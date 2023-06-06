package com.quizzy.android.DataStructures;

public class Question {
    private Answer answer1;
    private Answer answer2;
    private Answer answer3;
    private Answer answer4;
    private boolean hasImage;
    private String image;
    private boolean isFlagged;
    private String question;

    public Question() {
    }

    public Question(Answer answer1, Answer answer2, Answer answer3, Answer answer4, boolean hasImage, String image, boolean isFlagged, String question) {
        this.answer1 = answer1;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.hasImage = hasImage;
        this.image = image;
        this.isFlagged = isFlagged;
        this.question = question;
    }

    public Answer getAnswer1() {
        return answer1;
    }

    public void setAnswer1(Answer answer1) {
        this.answer1 = answer1;
    }

    public Answer getAnswer2() {
        return answer2;
    }

    public void setAnswer2(Answer answer2) {
        this.answer2 = answer2;
    }

    public Answer getAnswer3() {
        return answer3;
    }

    public void setAnswer3(Answer answer3) {
        this.answer3 = answer3;
    }

    public Answer getAnswer4() {
        return answer4;
    }

    public void setAnswer4(Answer answer4) {
        this.answer4 = answer4;
    }

    public boolean isHasImage() {
        return hasImage;
    }

    public void setHasImage(boolean hasImage) {
        this.hasImage = hasImage;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
