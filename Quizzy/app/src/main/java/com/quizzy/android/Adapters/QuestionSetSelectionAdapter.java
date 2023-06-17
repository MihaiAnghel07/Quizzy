package com.quizzy.android.Adapters;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.google.firebase.database.DatabaseReference;
import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.R;

import java.util.List;

public class QuestionSetSelectionAdapter extends BaseAdapter {
    private Context context;
    private List<QuestionSet> questionSetList;
    List<String> questionSetIds;
    private DatabaseReference databaseRef;

    public QuestionSetSelectionAdapter(Context context, List<QuestionSet> questionSetList, List<String> questionSetIds) {
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
            convertView = LayoutInflater.from(context).inflate(R.layout.list_item_question_set_selection, parent, false);

            holder = new ViewHolder();
            holder.titleTextView = convertView.findViewById(R.id.titleTextView);
            holder.authorTextView = convertView.findViewById(R.id.authorTextView);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        // Set the title and author in the TextViews
        holder.titleTextView.setText(questionSet.getTitle());
        holder.authorTextView.setText(questionSet.getAuthor());

        return convertView;
    }


    private static class ViewHolder {
        TextView titleTextView;
        TextView authorTextView;
    }
}
