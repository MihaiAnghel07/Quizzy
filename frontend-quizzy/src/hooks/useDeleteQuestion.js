import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useDeleteQuestion = () => {

    const deleteQuestion = async (questionId, quizId) => {
        console.log(questionId  + "  " + quizId);
        const username = localStorage.getItem("username");
        let image = null;

        const ref = projectFirebaseRealtime.ref('Quizzes/' + username + '/' + quizId + "/Questions/");
        await ref.child(questionId).once("value", (snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val().hasImage) {
                    image = snapshot.val().image;
                }
            }
        });
        ref.child(questionId).remove().then(() => console.log("Question deleted")).catch((error) => console.log("Error: ", error));

        if (image != null) {
            const ref2 = projectFirebaseStorage.ref('Images/' + username + '/' + quizId + "/Questions/" + questionId + '/');
            ref2.child(image).delete().then(() => console.log("Image of question deleted")).catch((error) => console.log("Error: ", error));
        }

    }

    return { deleteQuestion }
}