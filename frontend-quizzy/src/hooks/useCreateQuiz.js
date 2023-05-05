import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useCreateQuiz = () => {
    const [error, setError] = useState(null)
    const [isQuizCreated, setIsQuizCreated] = useState(false)
    const [quizKey, setQuizKey] = useState(null)
    let exists = false;

    let quizTemplate = {
        Author: '',
        Title: '',
        Questions: [],
        isPublic: false
    };

    let username = firebase.auth().currentUser.displayName;
    
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const createQuiz = (quizTitle, quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, quizCorrectAnswer, isPublic) => {
        quizTemplate.Author = username;
        quizTemplate.Title = quizTitle;
        quizTemplate.Questions = [{'question':quizQuestion,
                                   'answer1': quizAnswer1,
                                   'answer2': quizAnswer2,
                                   'answer3': quizAnswer3,
                                   'answer4': quizAnswer4,
                                   'correct_answer': quizCorrectAnswer}];
        quizTemplate.isPublic = isPublic;
        
        const ref = projectFirebaseRealtime.ref('Quizzes');

        // if (isPublic) {
            ref.child(username).get().then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.val().Title == quizTitle) {
                            // there is another quiz having the same title
                            setError("There is another quiz having the same title");
                            exists = true;
                            setIsQuizCreated(false);
                        }
                    })
                }

                if (!exists) {
                    //projectFirebaseRealtime.ref('Quizzes/'+ username + '/noQuizzes').set(firebase.database.ServerValue.increment(1));
                    //let key = snapshot.child('noQuizzes').val();
                    let newKey = getTimeEpoch();
                    setQuizKey(newKey);
                    projectFirebaseRealtime.ref('Quizzes/' + username + '/' + newKey).set(quizTemplate);  
                    setIsQuizCreated(true);
                }
            })

        // } else {
           
        //     ref.child('private/' + username).get().then((snapshot) => {
        //         if (snapshot.exists()) {
        //             snapshot.forEach(childSnapshot => {
        //                 if (childSnapshot.val().Title == quizTitle) {
        //                     // there is another quiz having the same title
        //                     setError("There is another quiz having the same title");
        //                     exists = true;
        //                     setIsQuizCreated(false);
        //                 }
        //             })

        //             if (!exists) {
        //                 projectFirebaseRealtime.ref('Quizzes/private/' + username + '/noQuizzes').set(firebase.database.ServerValue.increment(1));
        //                 let key = snapshot.child('noQuizzes').val();
        //                 let newKey = projectFirebaseRealtime.ref('Quizzes/private/' + username).push().key;
        //                 projectFirebaseRealtime.ref('Quizzes/private/' + username + '/' + getTimeEpoch()).set(quizTemplate);  
        //                 setError(null);
        //                 setIsQuizCreated(true);
        //             }

        //         } else {
        //             // first entry
        //             projectFirebaseRealtime.ref('Quizzes/private/' + username + '/noQuizzes').set(1);
        //             projectFirebaseRealtime.ref('Quizzes/private/' + username + '/0').set(quizTemplate); 
        //             setIsQuizCreated(true);
        //         }
        //     })
        // }
                  
    }

    return { createQuiz, isQuizCreated, error, quizKey }
}