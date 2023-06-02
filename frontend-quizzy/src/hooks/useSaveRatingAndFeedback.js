import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useSaveRatingAndFeedback = () => {
    
    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    const saveRatingAndFeedback = async (host, quizId, rating, feedback) => { 
        
        if (rating !== 0)
            projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + quizId + '/ratings/' + getTimeEpoch()).set({rating:rating});

        if (feedback !== "")
            projectFirebaseRealtime.ref("History/host/" + host + '/quizzes/' + quizId + '/feedbacks/' + getTimeEpoch()).set({feedback:feedback});                   
    
    }
       

    return { saveRatingAndFeedback }
}