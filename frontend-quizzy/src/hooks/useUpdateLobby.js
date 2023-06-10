import React, { useState } from 'react'
import { projectFirebaseRealtime } from '../firebase/config'
import { useEffect } from 'react';

export const useUpdateLobby = () => {
    const [error, setError] = useState(null);

    const updateLobby = async (lobbyCode, quizId, quizAuthor, quizTitle, duration, timestamp, errorCallback) => {
        
        const ref = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode);
        await ref.once("value", async (snapshot) => {
            
            if (!snapshot.val().participants) {
                setError("You cannot start the quiz with no participants in lobby");
                errorCallback("You cannot start the quiz with no participants in lobby");
            
            } else {

                await projectFirebaseRealtime.ref('Lobbies/' + lobbyCode)
                .set({code: snapshot.val().code,
                        gameStatus: 'in progress',
                        host: snapshot.val().host,
                        lobbyId: snapshot.val().lobbyId,
                        noParticipants: snapshot.val().noParticipants,
                        participants: snapshot.val().participants,
                        questionIndex: snapshot.val().questionIndex,
                        quizId: quizId,
                        quizAuthor: quizAuthor,
                        quizTitle: quizTitle,
                        duration: duration,
                        timestamp: timestamp
                    })
                
                setError(null);
                errorCallback(null);
            }
                
        })
    }

    return { updateLobby, error }
}