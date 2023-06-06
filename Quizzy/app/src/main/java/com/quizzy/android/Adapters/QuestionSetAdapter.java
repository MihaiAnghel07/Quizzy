package com.quizzy.android.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.R;

import java.util.List;

public class QuestionSetAdapter extends ArrayAdapter<QuestionSet> {
    private LayoutInflater inflater;
    private String currentUserId;

    public QuestionSetAdapter(Context context, List<QuestionSet> questionSetList, String currentUserId) {
        super(context, 0, questionSetList);
        inflater = LayoutInflater.from(context);
        this.currentUserId = currentUserId;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder;

        if (convertView == null) {
            convertView = inflater.inflate(R.layout.item_question_set, parent, false);
            holder = new ViewHolder();
            holder.titleTextView = convertView.findViewById(R.id.titleTextView);
            holder.detailsTextView = convertView.findViewById(R.id.detailsTextView);
            holder.editImageView = convertView.findViewById(R.id.editImageView);
            holder.deleteImageView = convertView.findViewById(R.id.deleteImageView);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        QuestionSet questionSet = getItem(position);

        if (questionSet != null) {
            holder.titleTextView.setText(questionSet.getTitle());

            if (currentUserId.equals(questionSet.getAuthor())) {
                // Current user is the owner of the question set
                holder.detailsTextView.setText(questionSet.getIsPublic() ? "Public" : "Private");
                holder.editImageView.setVisibility(View.VISIBLE);
                holder.deleteImageView.setVisibility(View.VISIBLE);
                //holder.copyImageView.setVisibility(View.GONE);
            } else {
                // Current user is viewing someone else's question set
                holder.detailsTextView.setText("Owner: " + questionSet.getAuthor());
                holder.editImageView.setVisibility(View.GONE);
                holder.deleteImageView.setVisibility(View.GONE);
                holder.copyImageView.setVisibility(View.VISIBLE);
            }

            // Handle edit icon click
            holder.editImageView.setOnClickListener(v -> {
                // Handle edit icon click
            });

            // Handle delete icon click
            holder.deleteImageView.setOnClickListener(v -> {
                // Handle delete icon click
            });

            // Handle copy icon click
//            holder.copyImageView.setOnClickListener(v -> {
//                // Handle copy icon click
//            });
        }

        return convertView;
    }

    private static class ViewHolder {
        TextView titleTextView;
        TextView detailsTextView;
        ImageView editImageView;
        ImageView deleteImageView;
        ImageView copyImageView;
    }
}
