import { projectFirebaseRealtime } from '../firebase/config'


export const useUpdateQuiz = () => {


    const updateQuiz = (quizAuthor, quizId, quizTitle, isPublic) => {
        const ref = projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId);
        ref.once('value', (snapshot) => {
            if (quizTitle !== snapshot.val().Title) {
                projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId + '/Title').set(quizTitle);
            }

            if (isPublic !== snapshot.val().isPublic) {
                projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId + '/isPublic').set(isPublic);
            }
        })
    }
        

    return { updateQuiz }
}