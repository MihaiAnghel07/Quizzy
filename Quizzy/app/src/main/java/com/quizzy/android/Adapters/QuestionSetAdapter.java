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
import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.EditQuestionSetActivity;
import com.quizzy.android.PreferenceHelper;
import com.quizzy.android.R;

import java.util.List;

public class QuestionSetAdapter extends BaseAdapter {
    private Context context;
    private List<QuestionSet> questionSetList;
    List<String> questionSetIds;
    private DatabaseReference databaseRef;

    public QuestionSetAdapter(Context context, List<QuestionSet> questionSetList, List<String> questionSetIds) {
        this.context = context;
        this.questionSetList = questionSetList;
        this.questionSetIds = questionSetIds;
    }

    @Override
    public int getCount() {
        return questionSetList.size();
    }

    @Override
    public Object getItem(int position) {
        return questionSetList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;

        // Get the current QuestionSet object
        QuestionSet questionSet = questionSetList.get(position);
        String quizId = questionSetIds.get(position);

        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.list_item_question_set, parent, false);

            holder = new ViewHolder();
            holder.titleTextView = convertView.findViewById(R.id.titleTextView);
            holder.authorTextView = convertView.findViewById(R.id.authorTextView);
            holder.editImageView = convertView.findViewById(R.id.editImageView);
            holder.deleteImageView = convertView.findViewById(R.id.deleteImageView);
            holder.copyImageView = convertView.findViewById(R.id.copyImageView);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        // Set the visibility of the icons based on the author
        if (questionSet.getAuthor().equals(PreferenceHelper.getUsername(context))) {
            holder.editImageView.setVisibility(View.VISIBLE);
            holder.deleteImageView.setVisibility(View.VISIBLE);
            holder.copyImageView.setVisibility(View.GONE);
        } else {
            holder.editImageView.setVisibility(View.GONE);
            holder.deleteImageView.setVisibility(View.GONE);
            holder.copyImageView.setVisibility(View.VISIBLE);
        }

        // Set click listeners for the icons
        holder.editImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent newIntent = new Intent(context, EditQuestionSetActivity.class);
                newIntent.putExtra("quizId", quizId);
                newIntent.putExtra("quizAuthor", questionSet.getAuthor());
                newIntent.putExtra("visibility", questionSet.getIsPublic());
                context.startActivity(newIntent);
            }
        });

        holder.deleteImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Ask user to confirm deleting question set
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage("Are you sure you want to delete this question set?")
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // If user confirms, delete question set
                                Toast.makeText(context, "Question set deleted successfully", Toast.LENGTH_SHORT).show();
                                String username = PreferenceHelper.getUsername(context);
                                databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");
                                databaseRef.child(username).child(quizId).removeValue();
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

        holder.copyImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                QuestionSet questionSetDuplicate = new QuestionSet();
                questionSetDuplicate.setQuestions(questionSet.getQuestions());
                questionSetDuplicate.setTitle(questionSet.getTitle());
                questionSetDuplicate.setIsPublic(true);
                String username = PreferenceHelper.getUsername(context);
                questionSetDuplicate.setAuthor(username);

                String key = String.valueOf(System.currentTimeMillis());
                databaseRef = FirebaseDatabase.getInstance().getReference("Quizzes");
                databaseRef.child(username).child(key).setValue(questionSetDuplicate);

                Toast.makeText(context, "Question set copied successfully", Toast.LENGTH_SHORT).show();
            }
        });

        // Set the title and author in the TextViews
        holder.titleTextView.setText(questionSet.getTitle());
        holder.authorTextView.setText(questionSet.getAuthor());

        return convertView;
    }


    private static class ViewHolder {
        TextView titleTextView;
        TextView authorTextView;
        ImageView editImageView;
        ImageView deleteImageView;
        ImageView copyImageView;
    }
}
