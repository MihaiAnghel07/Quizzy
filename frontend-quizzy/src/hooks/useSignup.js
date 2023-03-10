import { useEffect, useState } from "react"
import { projectFirebaseAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password) => {
        setError(null)
        setIsPending(true)
        
        try {
            //signup user
            const res = await projectFirebaseAuth.createUserWithEmailAndPassword(email, password)
            console.log(res.user)
            
            if (!res) {
                throw new Error("Could not complete signup")
            }

            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user })
            
            // update state
            //if (!isCancelled) {
                setIsPending(false)
                setError(null)
            //}

        } catch (err) {
            //if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            //}
        }
        
    }

    // useEffect(() => {
    //     return () => setIsCancelled(true)
    // }, [])

    return {error, isPending, signup}  
    
}