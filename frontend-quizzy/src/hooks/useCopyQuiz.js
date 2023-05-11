import { projectFirebaseRealtime } from '../firebase/config'
import { useGetTimeEpoch } from './useGetTimeEpoch';
import firebase from "firebase/app";


export const useCopyQuiz= () => {
    const { getTimeEpoch } = useGetTimeEpoch();

    let quizTemplate = {
        Author: '',
        Title: '',
        Questions: [],
        isPublic: false
    };

    const copyQuiz = (quizId, quizAuthor) => {
        let email = localStorage.getItem('user');
        let username = localStorage.getItem('username');
        let newKey = getTimeEpoch();
        
        projectFirebaseRealtime.ref('Quizzes/' + quizAuthor).child(quizId).get().then((snapshot) => {
            quizTemplate.Author = username;
            quizTemplate.Title = snapshot.val().Title;
            quizTemplate.Questions = snapshot.val().Questions;
            quizTemplate.isPublic = false;
            
            projectFirebaseRealtime.ref('Quizzes/' + username + '/' + newKey).set(quizTemplate);
        })

    }

    return { copyQuiz }
}