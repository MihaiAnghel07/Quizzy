import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useSaveStatistics = () => {
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const saveStatistics = async (lobbyCode, answerOption, question, questionId, answer1, answer2, answer3, answer4, hasImage, image, isFlagged) => {
        let host = null;
        let lobbyId = null;
        let quizTitle = null;
        const questionTemplate = []
        questionTemplate.push({'question': question,
        'answer1': {'text':answer1.text, 'isCorrect': answer1.isCorrect, 'isSelected': answerOption.text === answer1.text},
        'answer2': {'text':answer2.text, 'isCorrect': answer2.isCorrect, 'isSelected': answerOption.text === answer2.text},
        'answer3': {'text':answer3.text, 'isCorrect': answer3.isCorrect, 'isSelected': answerOption.text === answer3.text},
        'answer4': {'text':answer4.text, 'isCorrect': answer4.isCorrect, 'isSelected': answerOption.text === answer4.text},
        'hasImage': hasImage,
        'image': hasImage ? image : null,
        'isFlagged': isFlagged})
    

        let participantUsername = localStorage.getItem("username");
        const ref = projectFirebaseRealtime.ref("Lobbies/" + lobbyCode);

      
        await ref.once('value', (snapshot) => {
            host = snapshot.val().host;
            lobbyId = snapshot.val().lobbyId;
            quizTitle = snapshot.val().quizTitle;
        
        })

       
        const ref2 = projectFirebaseRealtime.ref("History/participant/" + participantUsername + '/quizzes/' + lobbyId + '/');
        ref2.once('value', (snapshot) => {
            if (snapshot.exists()) {
                
                projectFirebaseRealtime.ref("History/participant/" + participantUsername + '/quizzes/' + lobbyId + '/questions/' + questionId)
                        .set(questionTemplate[0]);

            } else {
                projectFirebaseRealtime.ref("History/participant/" + participantUsername + '/quizzes/' + lobbyId + '/')
                        .set({'quizTitle': quizTitle});
                projectFirebaseRealtime.ref("History/participant/" + participantUsername + '/quizzes/' + lobbyId + '/questions/'  + questionId)
                        .set(questionTemplate[0]);
            
            }

        })  

        const ref3 = projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + lobbyId + '/');
        ref3.once('value', (snapshot) => {
            if (snapshot.exists()) {
                
                projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + lobbyId + '/' + participantUsername + '/questions/'  + questionId)
                        .set(questionTemplate[0]);

            } else {
                projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + lobbyId + '/')
                        .set({'quizTitle': quizTitle});
                projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + lobbyId + '/' + participantUsername + '/questions/'  + questionId)
                        .set(questionTemplate[0]);
            
            }

        }) 

        // updatam statisticile per intrebare
        // if ((answer1.isCorrect && answerOption.text === answer1.text)
        //      || (answer2.isCorrect && answerOption.text === answer2.text)
        //      || (answer3.isCorrect && answerOption.text === answer3.text)
        //      || (answer4.isCorrect && answerOption.text === answer4.text))
        //     projectFirebaseRealtime.ref("Statistics/host/" + host + '/quizzes/' + lobbyId + '/' + questionId + '/correctAnswers').set(firebase.database.ServerValue.increment(1))
        // else
        //     projectFirebaseRealtime.ref("Statistics/host/" + host + '/quizzes/' + lobbyId + '/' + questionId + '/wrongAnswers').set(firebase.database.ServerValue.increment(1))

                                
    
    }
       

    return { saveStatistics }
}