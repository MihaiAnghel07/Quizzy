import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useAddQuestion = () => {
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const addQuestion = (quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, quizCorrectAnswer, quizKey) => {
        let question = {'question':quizQuestion,
                        'answer1': quizAnswer1,
                        'answer2': quizAnswer2,
                        'answer3': quizAnswer3,
                        'answer4': quizAnswer4,
                        'correct_answer': quizCorrectAnswer};

        let username = firebase.auth().currentUser.displayName;
        let newKey = getTimeEpoch();

        projectFirebaseRealtime.ref('Quizzes/' + username + '/' + quizKey + "/Questions/" + newKey).set(question);  
        // daca e public, adaugam si in private si in public?
        //projectFirebaseRealtime.ref('Quizzes/public/' + ID2 + "/Questions").set(question);  

    }

    return { addQuestion }
}