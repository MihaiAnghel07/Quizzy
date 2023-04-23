import { useEffect, useState } from "react"
import { projectFirebaseAuth, projectFirebaseRealtime } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"
import firebase from "firebase/app";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    var err = null;

    const signup = async (username, email, password) => {
        setError(null)
        setIsPending(true)
        err = null;
        
        try {
            // check if username is valid
            const ref = projectFirebaseRealtime.ref('Users');
            ref.get().then(async (snapshot) => {
                if (snapshot.exists()) {

                    snapshot.forEach(childSnapshot => {
                        let data = childSnapshot.val();
                        if (username == data.username) {
                            setError("A user with this username already exists");
                            err = 'A user with this username already exists';
                            console.log(data.username);
                            setIsPending(false);
                        }
                    })

                    // update user entry
                    if (err == null) {
                        projectFirebaseRealtime.ref('Users/noUsers').set(firebase.database.ServerValue.increment(1));
                        let key = snapshot.child('noUsers').val();
                        projectFirebaseRealtime.ref('Users/' + key).set({'username': username, 'email': email});  
                    }
                    //let noParticipants = snapshot.child('noParticipants').val() + 1;
                    //projectFirebaseRealtime.ref('Lobbies/' + lobbyCode).update({'noParticipants': noParticipants});
                    
                    // update participants list
                    // projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/participants/' + (noParticipants - 1)).set({'name':sessionStorage.getItem('user'), 'score': 0});
                    
                } else {
                    // add first entry
                    projectFirebaseRealtime.ref('Users/0').set({'username': username, 'email': email});
                    projectFirebaseRealtime.ref('Users/noUsers').set(firebase.database.ServerValue.increment(1));
                }

                if (err == null) {
                    //signup user
                    const res = await projectFirebaseAuth.createUserWithEmailAndPassword(email, password)
                    
                    if (!res) {
                        throw new Error("Could not complete signup")
                    }

                    // dispatch login action
                    dispatch({ type: 'LOGIN', payload: res.user })
                    
                    setIsPending(false)
                    setError(null)
                    
                }
            })
    
        } catch (err) {
            console.log(err.message)
            setError(err.message)
            setIsPending(false)
        }
        
    }

    return {error, isPending, signup}  
    
}