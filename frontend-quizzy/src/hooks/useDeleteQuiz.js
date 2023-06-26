import { projectFirebaseRealtime } from '../firebase/config'


export const useDeleteQuiz= () => {

    const deleteQuiz = (quizKey, quizAuthor) => {
        projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizKey).remove();  
    }

    return { deleteQuiz }
}