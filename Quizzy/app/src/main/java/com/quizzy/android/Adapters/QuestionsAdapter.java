package com.quizzy.android.Adapters;


import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.quizzy.android.DataStructures.Question;
import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.EditQuestionActivity;
import com.quizzy.android.EditQuestionSetActivity;
import com.quizzy.android.HistoryActivity;
import com.quizzy.android.HomeActivity;
import com.quizzy.android.PreferenceHelper;
import com.quizzy.android.QuestionSetsActivity2;
import com.quizzy.android.R;

import java.util.List;

public class QuestionsAdapter extends BaseAdapter {
    private Context context;
    private List<Question> questionList;
    List<String> questionIds;
    private DatabaseReference databaseRef;
    private String quizAuthor;
    private String quizId;

    public QuestionsAdapter(Context context, List<Question> questionList, List<String> questionIds, String quizAuthor, String quizId) {
        this.context = context;
        this.questionList = questionList;
        this.questionIds = questionIds;
        this.quizAuthor = quizAuthor;
        this.quizId = quizId;
    }

    @Override
    public int getCount() {
        return questionList.size();
    }

    @Override
    public Object getItem(int position) {
        return questionList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;

        // Get the current QuestionSet object
        Question question = questionList.get(position);
        String questionId = questionIds.get(position);

        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.list_item_question, parent, false);

            holder = new ViewHolder();
            holder.questionTextView = convertView.findViewById(R.id.questionTextView);
            holder.editImageView = convertView.findViewById(R.id.editImageView);
            holder.deleteImageView = convertView.findViewById(R.id.deleteImageView);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        // Set icons visibility
        holder.editImageView.setVisibility(View.VISIBLE);
        holder.deleteImageView.setVisibility(View.VISIBLE);


        // Set click listeners for the icons
        holder.editImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(context, "Edit " + questionId, Toast.LENGTH_SHORT).show();

                Intent newIntent = new Intent(context, EditQuestionActivity.class);
                newIntent.putExtra("questionId", questionId);
                newIntent.putExtra("quizAuthor", quizAuthor);
                newIntent.putExtra("quizId", quizId);
                context.startActivity(newIntent);
            }
        });

        holder.deleteImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(context, "Delete " + questionId, Toast.LENGTH_SHORT).show();

                // Ask user to confirm deleting question
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage("Are you sure you want to delete this question?")
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // If user confirms, delete question set
                                String username = PreferenceHelper.getUsername(context);
                                databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");
                                databaseRef.child(username).child(quizId).child("Questions").child(questionId).removeValue();
                            }
                        })
                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // If the user cancels, dismiss the dialog
                                dialog.dismiss();
                            }
                        });
                // Create and show the dialog
                AlertDialog dialog = builder.create();
                dialog.show();
            }
        });


        // Set the title and author in the TextViews
        holder.questionTextView.setText(question.getQuestion());


        return convertView;
    }


    private static class ViewHolder {
        TextView questionTextView;
        ImageView editImageView;
        ImageView deleteImageView;
    }
}
