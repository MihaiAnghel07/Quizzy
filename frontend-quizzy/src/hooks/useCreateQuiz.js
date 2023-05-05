import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useCreateQuiz = () => {
    const [error, setError] = useState(null)
    const [quizKey, setQuizKey] = useState(null)
    let exists = false;

    let quizTemplate = {
        Author: '',
        Title: '',
        Questions: [],
        isPublic: false
    };

    let username = sessionStorage.getItem("username");
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const createQuiz = (quizTitle, quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, isPublic) => {
        quizTemplate.Author = username;
        quizTemplate.Title = quizTitle;
        quizTemplate.Questions = [{'question': quizQuestion,
                                   'answer1': {'text':quizAnswer1, 'isCorrect': selectedOption === 'answer1'},
                                   'answer2': {'text':quizAnswer2, 'isCorrect': selectedOption === 'answer2'},
                                   'answer3': {'text':quizAnswer3, 'isCorrect': selectedOption === 'answer3'},
                                   'answer4': {'text':quizAnswer4, 'isCorrect': selectedOption === 'answer4'},
                                   'hasImage': (imageUpload !== null && imageUpload.length !== 0)}];
        quizTemplate.isPublic = isPublic;
        
        const ref = projectFirebaseRealtime.ref('Quizzes');
        ref.child(username).get().then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    if (childSnapshot.val().Title == quizTitle) {
                        // there is another quiz having the same title
                        setError("There is another quiz having the same title");
                        exists = true;
                    }
                })
            }
            
            if (!exists) {
                let newKey = getTimeEpoch();
                setQuizKey(newKey);
                projectFirebaseRealtime.ref('Quizzes/' + username + '/' + newKey).set(quizTemplate);  

                //add question image, if exists
                if (imageUpload !== null && imageUpload.length !== 0) {
                    console.log(imageUpload[0].name)
                    let ref = projectFirebaseStorage.ref('Images/');
                    ref.child(username + '/' + newKey + '/' + 'Questions/0/' + imageUpload[0].name).put(imageUpload[0]).then((snapshot) => {
                        console.log("Uploading state: " + snapshot.state);
                        console.log("File uploaded!")
                    });
                }
            }
        })
                  
    }

    return { createQuiz, error, quizKey }
}