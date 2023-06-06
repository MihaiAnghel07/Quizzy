package com.quizzy.android.Adapters;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.quizzy.android.DataStructures.QuestionSet;
import com.quizzy.android.R;

import java.util.List;

public class QuestionSetAdapter2 extends BaseAdapter {
    private Context context;
    private List<QuestionSet> questionSetList;

    public QuestionSetAdapter2(Context context, List<QuestionSet> questionSetList) {
        this.context = context;
        this.questionSetList = questionSetList;
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

        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.list_item_question_set2, parent, false);

            holder = new ViewHolder();
            holder.titleTextView = convertView.findViewById(R.id.titleTextView);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        // Get the current QuestionSet object
        QuestionSet questionSet = questionSetList.get(position);

        // Set the title in the TextView
        holder.titleTextView.setText(questionSet.getTitle());

        return convertView;
    }

    private static class ViewHolder {
        TextView titleTextView;
    }
}
