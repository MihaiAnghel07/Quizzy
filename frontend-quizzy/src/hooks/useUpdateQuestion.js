import React from 'react'
import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'


export const useUpdateQuestion = () => {


    const updateQuestion = (quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, questionKey, quizKey, quizAuthor) => {
        const ref = projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizKey + "/Questions/" + questionKey);
        
        if (imageUpload !== null && imageUpload.length !== 0) {

            let question = {'question': quizQuestion,
            'answer1': {'text':quizAnswer1.text, 'isCorrect': selectedOption === 'answer1'},
            'answer2': {'text':quizAnswer2.text, 'isCorrect': selectedOption === 'answer2'},
            'answer3': {'text':quizAnswer3.text, 'isCorrect': selectedOption === 'answer3'},
            'answer4': {'text':quizAnswer4.text, 'isCorrect': selectedOption === 'answer4'},
            'hasImage': true,
            'image': imageUpload[0].name,
            'isFlagged': false};

            projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizKey + "/Questions/" + questionKey).set(question);

            let ref2 = projectFirebaseStorage.ref('Images/');
            ref2.child(quizAuthor + '/' + quizKey + '/' + 'Questions/' + questionKey + '/' + imageUpload[0].name).put(imageUpload[0]).then((snapshot) => {
                console.log("Uploading state: " + snapshot.state);
                console.log("File uploaded!")
            });
            
        } else {
            ref.once('value', (snapshot) => {
                let hasImage = snapshot.val().hasImage;
                let question = {'question': quizQuestion,
                'answer1': {'text':quizAnswer1.text, 'isCorrect': selectedOption === 'answer1'},
                'answer2': {'text':quizAnswer2.text, 'isCorrect': selectedOption === 'answer2'},
                'answer3': {'text':quizAnswer3.text, 'isCorrect': selectedOption === 'answer3'},
                'answer4': {'text':quizAnswer4.text, 'isCorrect': selectedOption === 'answer4'},
                'hasImage': (hasImage? true : false),
                'image': (hasImage? snapshot.val().image : null),
                'isFlagged': false};

                projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizKey + "/Questions/" + questionKey).set(question);
                
                
            })

        }        
        
    }

    return { updateQuestion }
}