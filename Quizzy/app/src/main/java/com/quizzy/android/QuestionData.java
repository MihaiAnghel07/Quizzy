package com.quizzy.android;

public class QuestionData {
    private AnswerData answer1;
    private AnswerData answer2;
    private AnswerData answer3;
    private AnswerData answer4;
    private Boolean hasImage;
    private String image;
    private Boolean isFlagged;
    private String question;
    private String id;

    public QuestionData() {

    }


    public QuestionData(AnswerData answer1, AnswerData answer2, AnswerData answer3, AnswerData answer4, Boolean hasImage, String image, Boolean isFlagged, String question, String id) {
        this.answer1 = answer1;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.hasImage = hasImage;
        this.image = image;
        this.isFlagged = isFlagged;
        this.question = question;
        this.id = id;
    }


    public AnswerData getAnswer1() {
        return answer1;
    }

    public void setAnswer1(AnswerData answer1) {
        this.answer1 = answer1;
    }

    public AnswerData getAnswer2() {
        return answer2;
    }

    public void setAnswer2(AnswerData answer2) {
        this.answer2 = answer2;
    }

    public AnswerData getAnswer3() {
        return answer3;
    }

    public void setAnswer3(AnswerData answer3) {
        this.answer3 = answer3;
    }

    public AnswerData getAnswer4() {
        return answer4;
    }

    public void setAnswer4(AnswerData answer4) {
        this.answer4 = answer4;
    }

    public Boolean getHasImage() {
        return hasImage;
    }

    public void setHasImage(Boolean hasImage) {
        this.hasImage = hasImage;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getFlagged() {
        return isFlagged;
    }

    public void setFlagged(Boolean flagged) {
        isFlagged = flagged;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
