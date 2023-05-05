import { useState, useEffect } from "react";
import { projectFirebaseAuth } from '../firebase/config'
import { useAuthContext } from "./useAuthContext";
import useRefreshToken from "./useRefreshToken";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const refresh = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true)

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)
      
        //sign the user in
        try {
            const res = await projectFirebaseAuth.signInWithEmailAndPassword(email, password)

            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user })
            //console.log("1")
            // update state
            //if (!isCancelled) {
                setIsPending(false)
                setError(null)
            //}
            //console.log("2")
        } catch (err) {
           // if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            //}
        }
    }

    // useEffect(() => {
    //     console.log("LALALALAL")
    //     setIsCancelled(true)
    // }, [dispatch])

    // useEffect(() => {
    //     const verifyRefreshToken = async () => {
    //         try {
    //             await refresh()
    //         }
    //         catch (err) {
    //             console.error(err)
    //         }
    //         finally {
    //             setIsLoading(false)
    //         }
    //     }

    //     !dispatch?.accessToken ? verifyRefreshToken() : setIsLoading(false)
    // }, [])

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`)
    //     console.log(`aT: ${JSON.stringify(dispatch?.accessToken)}`)
    // }, [isLoading])
    
    return { login, error, isPending }
}