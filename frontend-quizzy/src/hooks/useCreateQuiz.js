import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useCreateQuiz = () => {
    const [error, setError] = useState(null)
    const [isQuizCreated, setIsQuizCreated] = useState(false)
    var exists = false;

    let quizTemplate = {
        Author: '',
        Title: '',
        Questions: []
    };

    const createQuiz = (quizTitle, quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, quizCorrectAnswer, isPublic) => {
        quizTemplate.Author = sessionStorage.getItem('user');
        quizTemplate.Title = quizTitle;
        quizTemplate.Questions = [{'question':quizQuestion,
                                   'answer1': quizAnswer1,
                                   'answer2': quizAnswer2,
                                   'answer3': quizAnswer3,
                                   'answer4': quizAnswer4,
                                   'correct_answer': quizCorrectAnswer}];
        
        const ref = projectFirebaseRealtime.ref('Quizzes');

        if (isPublic) {
            ref.child('public').get().then((snapshot) => {
                projectFirebaseRealtime.ref('Quizzes/public/noQuizzes').set(firebase.database.ServerValue.increment(1));
                let key = snapshot.child('noQuizzes').val();
                projectFirebaseRealtime.ref('Quizzes/public/' + key).set(quizTemplate);  
                setIsQuizCreated(true);
            })

        } else {
            let username = firebase.auth().currentUser.displayName;
           
            ref.child('private/' + username).get().then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.val().Title == quizTitle) {
                            // there is another quiz having the same title
                            setError("There is another quiz having the same title");
                            exists = true;
                            setIsQuizCreated(false);
                        }
                    })

                    if (!exists) {
                        projectFirebaseRealtime.ref('Quizzes/private/' + username + '/noQuizzes').set(firebase.database.ServerValue.increment(1));
                        let key = snapshot.child('noQuizzes').val();
                        projectFirebaseRealtime.ref('Quizzes/private/' + username + '/' + key).set(quizTemplate);  
                        setError(null);
                        setIsQuizCreated(true);
                    }

                } else {
                    // first entry
                    projectFirebaseRealtime.ref('Quizzes/private/' + username + '/noQuizzes').set(1);
                    projectFirebaseRealtime.ref('Quizzes/private/' + username + '/0').set(quizTemplate); 
                    setIsQuizCreated(true);
                }
            })
        }
                  
    }

    return { createQuiz, isQuizCreated, error }
}