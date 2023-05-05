import { useState } from "react";
import { projectFirebaseRealtime } from '../firebase/config'
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";


export const useJoinLobby = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const [isLoading, setIsLoading] = useState(true)
    let navigate = useNavigate();

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

    const delay = ms => new Promise (
        resolve => setTimeout(resolve, ms)
      );
    

    const join = async (lobbyCode) => {
        setError(null)
        setIsPending(true)
        

        if (validateLobbyCode(lobbyCode)) {

            try {
                const ref = projectFirebaseRealtime.ref('Lobbies');
                ref.child(lobbyCode).get().then(async (snapshot) => {
                    if (snapshot.exists()) {

                        // update noParticipants
                        console.log(snapshot.child('noParticipants').val());
                        let noParticipants = snapshot.child('noParticipants').val() + 1;
                        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode).update({'noParticipants': noParticipants});
                        
                        // update participants list
                        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/participants/' + (noParticipants - 1)).set({'name':sessionStorage.getItem('user'), 'score': 0});

                        // incepere activitate lobby
                        // ATENTIE! folosim navigate in hook. De cercetat daca exista o varianta mai buna
                        setIsPending(true)
                        await delay(700);
                        navigate('/participant_lobby');

                    } else {
                        setError("Nu exista un lobby cu acest cod!")
                    }
                })
               
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