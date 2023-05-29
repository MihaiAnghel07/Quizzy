import { projectFirebaseAuth } from '../firebase/config'
import { useState } from 'react'


export const useEditPassword = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const changePassword = async (password) => {
        setIsPending(true);
        setError(null)
            
        await projectFirebaseAuth.signInWithEmailAndPassword(localStorage.getItem("user"), localStorage.getItem("password"))
        .then(function(userCredential) {
            userCredential.user.updatePassword(password)
            localStorage.setItem("password", password);
        })
        .catch(err => {
            setError(err.message);
        })

        setIsPending(false);

    }

    return { changePassword, isPending, error}
}