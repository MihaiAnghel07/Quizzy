import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useSetHistoryInitialState = () => {
    const getTimestamp = () => {
        return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now())
    }

    const setHistoryInitialState = async (lobbyCode) => {
        const ref = projectFirebaseRealtime.ref("Lobbies/" + lobbyCode);
        ref.once('value', async (snapshot) => {
            if (snapshot.exists()) {

                // extragem intrebarile din setul de intrebari folosit (poate aparea problema ca proprietarul sa il modifice
                // pana la inceperea quiz-ului..
                const ref2 = projectFirebaseRealtime.ref("Quizzes/" + snapshot.val().quizAuthor + "/" + snapshot.val().quizId + "/");
                let questions = [];
                await ref2.once("value", (snapshot2) => {
                    if (snapshot2.exists()) {
                        questions=snapshot2.val().Questions;
                    }
                })
                
                // adaug campurile: isSelected, correctAnswers, wrongAnswers
                Object.keys(questions).map((el) => {
                            questions[el].answer1={isCorrect: questions[el].answer1.isCorrect, text: questions[el].answer1.text, isSelected: false}
                            questions[el].answer2={isCorrect: questions[el].answer2.isCorrect, text: questions[el].answer2.text, isSelected: false}
                            questions[el].answer3={isCorrect: questions[el].answer3.isCorrect, text: questions[el].answer3.text, isSelected: false}
                            questions[el].answer4={isCorrect: questions[el].answer4.isCorrect, text: questions[el].answer4.text, isSelected: false}})
                
                // setez istoricul
                await projectFirebaseRealtime.ref("History/host/" + snapshot.val().host + '/quizzes/' + snapshot.val().lobbyId + '/')
                        .set({'quizTitle': snapshot.val().quizTitle, 
                              'timestamp': getTimestamp()});
                
                
                for (const participant of snapshot.val().participants) {
                    projectFirebaseRealtime.ref("History/host/" + snapshot.val().host + '/quizzes/' + snapshot.val().lobbyId + '/' + participant.name + '/questions/')
                        .set(questions);

                    projectFirebaseRealtime.ref("History/participant/" + participant.name  + '/quizzes/' + snapshot.val().lobbyId + '/')
                        .set({'quizTitle': snapshot.val().quizTitle,
                              'timestamp': getTimestamp()});

                    projectFirebaseRealtime.ref("History/participant/" + participant.name  + '/quizzes/' + snapshot.val().lobbyId + '/questions/')
                        .set(questions);

                    // fac o copie a imaginilor pentru a avea acces la eledupa terminarea quiz-ului propriu-zis
                    const ref3 = projectFirebaseStorage.ref("Images/" + snapshot.val().quizAuthor + "/" + snapshot.val().quizId);

                    ref3.child("Questions").listAll().then((result) => {
                                    
                        result.prefixes.forEach((itemRef2) => {
                            itemRef2.listAll().then((result3) => {
                                
                                result3.items.forEach((itemRef3) => {
                                    
                                    const parts = itemRef3.fullPath.split('/');
                                    const questionId = parts[parts.length - 2];
                                    
                                    let newPath = "History/host/" + snapshot.val().host + "/quizzes/" + snapshot.val().lobbyId + "/" + participant.name + "/questions/" + questionId + "/" + parts[parts.length - 1];
                                    let newPath2 = "History/participant/" + participant.name  + "/quizzes/" + snapshot.val().lobbyId + "/questions/" + questionId + "/" + parts[parts.length - 1];
                                    
                                    const destinationRef = projectFirebaseStorage.ref(newPath);
                                    const destinationRef2 = projectFirebaseStorage.ref(newPath2);
                                
                                    itemRef3.getDownloadURL()
                                    .then((url) => {
                                        return fetch(url);
                                    })
                                    .then((response) => {
                                        return response.blob();
                                    })
                                    .then((blob) => {
                                        return destinationRef.put(blob);
                                    })
                                    .then(() => {
                                        console.log("Image copied successfully!");
                                    })
                                    .catch((error) => {
                                        console.error("EROARE0:" + error);
                                    });

                                    itemRef3.getDownloadURL()
                                    .then((url) => {
                                        return fetch(url);
                                    })
                                    .then((response) => {
                                        return response.blob();
                                    })
                                    .then((blob) => {
                                        return destinationRef2.put(blob);
                                    })
                                    .then(() => {
                                        console.log("Image copied successfully!");
                                    })
                                    .catch((error) => {
                                        console.error("EROARE0:" + error);
                                    });
                                })  
                            })       
                        })
                    }).catch((err)=> {
                        console.log("EROARE:" + err)
                    })


                    // initializez statisticile referitoare la numarul de raspunsuri corecte / gresite per intrebare
                    let questions2 = JSON.parse(JSON.stringify(questions))
                    Object.keys(questions2).map((el) => {questions2[el]={correctAnswers: 0, wrongAnswers: 0}})
                    projectFirebaseRealtime.ref("Statistics/host/" + snapshot.val().host + '/quizzes/' + snapshot.val().lobbyId + '/')
                                            .set(questions2);

                }

                
            }
        })
    
    }
       

    return { setHistoryInitialState }
}