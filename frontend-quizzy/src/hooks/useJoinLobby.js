import { useState, useEffect } from "react";
import { projectFirebaseRealtime } from '../firebase/config'
import { useAuthContext } from "./useAuthContext";


export const useJoinLobby = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const [isLoading, setIsLoading] = useState(true)

    const validateLobbyCode = (lobbyCode) => {
        if (lobbyCode.length != 4 || 
                !(lobbyCode.charAt(0) >= 0 && lobbyCode.charAt(0) <= 9) ||
                !(lobbyCode.charAt(1) >= 0 && lobbyCode.charAt(1) <= 9) ||
                !(lobbyCode.charAt(2) >= 0 && lobbyCode.charAt(2) <= 9) ||
                !(lobbyCode.charAt(3) >= 0 && lobbyCode.charAt(3) <= 9)) {
            setError("Codul trebuie sa contina doar cifre 0-9 si sa aiba lungimea de 4 caractere.");
          return false;
        }
    
        return true;
    }

    const join = async (lobbyCode) => {
        setError(null)
        setIsPending(true)

        if (validateLobbyCode(lobbyCode)) {

            //var newPostKey = projectFirebaseRealtime.ref('Lobbies').child("1234").push().key;

            //projectFirebaseRealtime.ref('Lobbies').child("1235").update(post);
            try {
                const ref = await projectFirebaseRealtime.ref('Lobbies');
                ref.child(lobbyCode).get().then((snapshot) => {
                    if (snapshot.exists()) {

                        // update noParticipants
                        console.log(snapshot.child('noParticipants').val());
                        let noParticipants = snapshot.child('noParticipants').val() + 1;
                        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode).update({'noParticipants': noParticipants});
                        
                        // update participants list
                        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/participants/' + (noParticipants - 1)).set({'name':sessionStorage.getItem('user'), 'score': 0});

                        // incepere activitate lobby
                        // TODO
                        
                    } else {
                        setError("Nu exista un lobby cu acest cod!")
                    }
                })
               
                // ref.once('value', function(snapshot) {
                //     console.log("A")
                //     if (snapshot.child(lobbyCode).exists()) {
                //         console.log("B")

                //         const refNoParticipants = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode);
                //         console.log("C")
                //         let noParticipants = 0;
                //         refNoParticipants.once('value', function(snapshotNoParticipants) {
                //             console.log("D")
                            
                //             noParticipants = parseInt(snapshotNoParticipants.child('noParticipants').val())
                //             noParticipants = noParticipants + 1
                //             console.log(noParticipants)
                //         })
                //         console.log(noParticipants)
                //         refNoParticipants.update({'noParticipants': noParticipants})

                    
                // })
                setError(null)
                setIsPending(false)
            } catch(err) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }

        } else {
            setIsPending(false);
        }
    }

    
    return { join, error, isPending }
}