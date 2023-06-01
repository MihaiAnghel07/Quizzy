package com.quizzy.android;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferenceHelper {
    private static final String PREF_NAME = "MyPreferences";
    private static final String KEY_LOGIN_STATUS = "loginStatus";
    private static final String USERNAME = "username";

    public static void setLoginStatus(Context context, boolean isLoggedIn) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit();
        editor.putBoolean(KEY_LOGIN_STATUS, isLoggedIn);
        editor.apply();
    }

    public static boolean getLoginStatus(Context context) {
        SharedPreferences preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return preferences.getBoolean(KEY_LOGIN_STATUS, false);
    }

    public static void setUsername(Context context, String username) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit();
        editor.putString(USERNAME, username);
        editor.apply();
    }

    public static String getUsername(Context context) {
        SharedPreferences preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return preferences.getString(USERNAME, "USER_NONE");
    }
}