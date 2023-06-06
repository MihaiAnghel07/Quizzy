package com.quizzy.android.DataStructures;

import java.util.ArrayList;

public class QuestionSet {
    private String id;
    private String Author;
    private ArrayList<Question> Questions;
    private String Title;
    private boolean isPublic;

    public QuestionSet() {
    }

    public QuestionSet(String id, String author, ArrayList<Question> questions, String title, boolean isPublic) {
        this.id = id;
        Author = author;
        Questions = questions;
        Title = title;
        this.isPublic = isPublic;
    }

    public String getAuthor() {
        return Author;
    }

    public void setAuthor(String author) {
        Author = author;
    }

    public ArrayList<Question> getQuestions() {
        return Questions;
    }

    public void setQuestions(ArrayList<Question> questions) {
        Questions = questions;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
