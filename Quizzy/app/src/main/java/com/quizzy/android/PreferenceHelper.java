package com.quizzy.android;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferenceHelper {
    private static final String PREF_NAME = "MyPreferences";
    private static final String KEY_LOGIN_STATUS = "loginStatus";
    private static final String USERNAME = "username";
    private static final String LOBBY_OPEN = "lobbyOpen";
    private static final String ACTIVE_LOBBY_CODE = "activeLobbyCode";
    private static final String QUIZ_STARTED = "quizStarted";

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

    public static void setLobbyOpen(Context context, boolean lobbyOpen) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit();
        editor.putBoolean(LOBBY_OPEN, lobbyOpen);
        editor.apply();
    }

    public static boolean getLobbyOpen(Context context) {
        SharedPreferences preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return preferences.getBoolean(LOBBY_OPEN, false);
    }

    public static void setActiveLobbyCode(Context context, String activeLobbyCode) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit();
        editor.putString(ACTIVE_LOBBY_CODE, activeLobbyCode);
        editor.apply();
    }

    public static String getActiveLobbyCode(Context context) {
        SharedPreferences preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return preferences.getString(ACTIVE_LOBBY_CODE, "LOBBYCODE_NONE");
    }


    public static void setQuizStarted(Context context, boolean quizStarted) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit();
        editor.putBoolean(QUIZ_STARTED, quizStarted);
        editor.apply();
    }

    public static boolean getQuizStarted(Context context) {
        SharedPreferences preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return preferences.getBoolean(QUIZ_STARTED, false);
    }
}