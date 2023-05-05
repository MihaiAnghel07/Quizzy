import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useDeleteQuiz= () => {

    const deleteQuiz = (quizKey, quizAuthor) => {
        projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizKey).remove();  
    }

    return { deleteQuiz }
}