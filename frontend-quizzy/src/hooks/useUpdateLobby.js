import React from 'react'
import { projectFirebaseRealtime } from '../firebase/config'

export const useUpdateLobby = () => {
    
    const updateLobby = (lobbyCode, quizId, quizAuthor, quizTitle, duration) => {
        const ref = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode);
        ref.child('quizId').set(quizId);
        ref.child('gameStatus').set('in progress');
        ref.child('quizAuthor').set(quizAuthor);
        ref.child('quizTitle').set(quizTitle);
        ref.child('duration').set(duration);
    }

    return { updateLobby }
}