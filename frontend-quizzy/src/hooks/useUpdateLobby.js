import React, { useState } from 'react'
import { projectFirebaseRealtime } from '../firebase/config'

export const useUpdateLobby = () => {
    const [error, setError] = useState("");

    const updateLobby = async (lobbyCode, quizId, quizAuthor, quizTitle, duration, timestamp) => {
        
        const ref = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode);
        await ref.once("value", async (snapshot) => {
            
            if (!snapshot.val().participants) {
                setError("You cannot start the quiz with no participants in lobby");
            
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
            }
                
        })
    }

    return { updateLobby, error }
}