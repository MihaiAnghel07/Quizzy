import { useState } from "react";
import { projectFirebaseAuth } from '../firebase/config'
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {

    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate();

    const logout = async () => {
        setError(null)
        setIsPending(true)

        //sign the user out
        try {
            await projectFirebaseAuth.signOut()

            // dispatch logout action
            dispatch({ type: 'LOGOUT' })
            navigate('/login', {replace:true})

            
            // update state
            setIsPending(false)
            setError(null)

        } catch (err) {
            console.log(err.message)
            setError(err.message)
            setIsPending(false)
            
        }
    }
    
    return { logout, error, isPending }
}