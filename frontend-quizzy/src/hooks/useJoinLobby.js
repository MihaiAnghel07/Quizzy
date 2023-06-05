import { useState } from "react";
import { projectFirebaseRealtime } from '../firebase/config'
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";


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
                        
                        if (snapshot.val().gameStatus === "on hold") {
                            
                            let alreadyExist = false;
                            snapshot.child("participants").forEach((childSnapshot) => {
                                if (childSnapshot.exists()) {
                                    if (childSnapshot.val().name === localStorage.getItem("username")) {
                                        alreadyExist = true;
                                    }
                                }
                            })

                            if (!alreadyExist) {
                                // update noParticipants
                                await projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/noParticipants').set(firebase.database.ServerValue.increment(1))
                                const ref2 = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/noParticipants');
                                ref2.once("value", (snapshot2) => {
                                    // update participants list
                                    projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/participants/' + (snapshot2.val() - 1)).set({'name':localStorage.getItem('username'), 'score': 0});

                                })

                                localStorage.removeItem("quizDuration");
                                localStorage.removeItem("currentQuestionCount");

                                const props = {
                                    lobbyCode: lobbyCode,
                                };

                                const queryString = Object.keys(props)
                                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}`)
                                    .join('&');

                                const url = `/participant_lobby?${queryString}`;

                                setIsPending(true)
                                await delay(700);
                                // const newTab = window.open(url, '_blank');
                                // newTab.focus();
                                navigate('/participant_lobby', {state:{lobbyCode:lobbyCode}});


                            } else {
                                setError("You are already in this lobby");
                            }   
                        
                        } else if (snapshot.val().gameStatus === "in progress") {
                            setError("The quiz has already started");
                        }
                                

                    } else {
                        setError("There is no lobby with this code!")
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