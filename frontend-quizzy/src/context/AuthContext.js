import { createContext, useEffect, useReducer, useState } from "react";
import { projectFirebaseAuth } from '../firebase/config';


export const AuthContext = createContext()

export const authReducer = (state, action) => {

    switch (action.type) {
        case 'LOGIN' :
            console.log("SET: ", action.payload.email)
            if (sessionStorage.getItem('user') == null)
                sessionStorage.setItem('user', action.payload.email)
            console.log("GET: ", sessionStorage.getItem('user'))
            return { ...state, user: sessionStorage.getItem('user') }
        case 'LOGOUT' :
            sessionStorage.removeItem('user')
            projectFirebaseAuth.signOut()
            return { ...state, user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    //const [state, setState] = useState(null);
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect (() => {
        console.log("localStorage: ", sessionStorage.getItem('user'))
        if (currentUser == null) 
            setCurrentUser(sessionStorage.getItem('user'));
        
        if (sessionStorage.getItem('user') !== null) {
            dispatch({ type: 'LOGIN', payload: sessionStorage.getItem('user') })
        }
            
    }, []);

    
    console.log("user = ", currentUser)
    console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* children este componenta ce urmeaza sa fie wrap-uita */}
            { children }
        </AuthContext.Provider>
    )
}