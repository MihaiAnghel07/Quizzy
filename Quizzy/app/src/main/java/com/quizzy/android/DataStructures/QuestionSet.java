package com.quizzy.android.DataStructures;

import com.google.firebase.database.IgnoreExtraProperties;
import com.google.firebase.database.PropertyName;

import java.util.ArrayList;

@IgnoreExtraProperties
public class QuestionSet {
    @PropertyName("Author")
    private String author;
    @PropertyName("Questions")
    private ArrayList<Question> questions;
    @PropertyName("Title")
    private String title;
    private boolean isPublic;

    public QuestionSet() {
    }

    public QuestionSet(String author, ArrayList<Question> questions, String title, boolean isPublic) {
        this.author = author;
        this.questions = questions;
        this.title = title;
        this.isPublic = isPublic;
    }

    @PropertyName("Author")
    public String getAuthor() {
        return author;
    }

    @PropertyName("Author")
    public void setAuthor(String author) {
        this.author = author;
    }

    @PropertyName("Questions")
    public ArrayList<Question> getQuestions() {
        return questions;
    }

    @PropertyName("Questions")
    public void setQuestions(ArrayList<Question> questions) {
        this.questions = questions;
    }

    @PropertyName("Title")
    public String getTitle() {
        return title;
    }

    @PropertyName("Title")
    public void setTitle(String title) {
        this.title = title;
    }

    public boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean aPublic) {
        isPublic = aPublic;
    }

}
