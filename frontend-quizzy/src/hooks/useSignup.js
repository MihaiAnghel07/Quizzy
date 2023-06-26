import { useState } from "react"
import { projectFirebaseAuth, projectFirebaseRealtime } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"
import firebase from "firebase/app";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const forbiddenChars = /[\[\]+-?=!@#$%^&*()~.,]/;
    const { dispatch } = useAuthContext()
    let err = null;

    function convertEmailToLowercase(email) {
        const [username, domain] = email.split('@');
        return `${username.toLowerCase()}@${domain}`;
    }

    const signup = async (username, email, password) => {
        setError(null)
        setIsPending(true)
        err = null;
        
        try {
            if (forbiddenChars.test(username)) {
                setError("Username cannot contains the following characters: /[\[\]+-?=!@#$%^&*()~.,]/");
                err = 'Username cannot contains the following characters: /[\[\]+-?=!@#$%^&*()~.,]/';
            }

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

                }
                

                if (err == null) {
                    //signup user
                    const res = await projectFirebaseAuth.createUserWithEmailAndPassword(email, password)
                    
                    if (!res) {
                        throw new Error("Could not complete signup")
                    }

                    projectFirebaseRealtime.ref('Users/noUsers').set(firebase.database.ServerValue.increment(1));
                    let uid = projectFirebaseAuth.currentUser.uid;
                    projectFirebaseRealtime.ref('Users/' + uid).set({'username': username, 'email': convertEmailToLowercase(email)}); 

                    //add also the username
                    await firebase.auth().currentUser.updateProfile({displayName: username});
                    
                    // dispatch login action
                    dispatch({ type: 'LOGIN', payload: res.user })
                    localStorage.setItem("password", password);
                    localStorage.setItem("uid", uid)

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