import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useAddQuestion = () => {
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const addQuestion = (quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, quizKey) => {
        let question = {'question': quizQuestion,
                        'answer1': {'text':quizAnswer1, 'isCorrect': selectedOption === 'answer1'},
                        'answer2': {'text':quizAnswer2, 'isCorrect': selectedOption === 'answer2'},
                        'answer3': {'text':quizAnswer3, 'isCorrect': selectedOption === 'answer3'},
                        'answer4': {'text':quizAnswer4, 'isCorrect': selectedOption === 'answer4'},
                        'hasImage': (imageUpload !== null && imageUpload.length !== 0),
                        'image': (imageUpload !== null && imageUpload.length !== 0) ? imageUpload[0].name : null };

        let username = sessionStorage.getItem("username");
        let newKey = getTimeEpoch();
        projectFirebaseRealtime.ref('Quizzes/' + username + '/' + quizKey + "/Questions/" + newKey).set(question);

        //add question image, if exists
        if (imageUpload !== null && imageUpload.length !== 0) { 
            console.log(imageUpload)
            let ref = projectFirebaseStorage.ref('Images/');
            ref.child(username + '/' + quizKey + '/' + 'Questions/' + newKey + '/' + imageUpload[0].name).put(imageUpload[0]).then((snapshot) => {
                console.log("Uploading state: " + snapshot.state);
                console.log("File uploaded!")
            });
        }

    }

    return { addQuestion }
}