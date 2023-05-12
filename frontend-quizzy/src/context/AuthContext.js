import { createContext, useEffect, useReducer, useState } from "react";
import { projectFirebaseAuth } from '../firebase/config';
import firebase from "firebase/app";
import { useGetUsername } from "../hooks/useGetUsername";
import Login from "../pages/login/Login";


export const AuthContext = createContext()


const SetUsernameFunction = () => { 
    const { getUsername } = useGetUsername();
    localStorage.setItem('username', getUsername());
}

export const authReducer = (state, action) => {
    
    switch (action.type) {
        case 'LOGIN' :
            console.log("SET: ", action.payload.email)
            console.log("parola: ", action.payload)
            if (localStorage.getItem('user') == null) {
                localStorage.setItem('user', action.payload.email)
            }
            console.log("GET: ", localStorage.getItem('user'))
            console.log("GET2: ", localStorage.getItem('username'))
            return { ...state, user: localStorage.getItem('user') }
        case 'LOGOUT' :
            localStorage.removeItem('user')
            localStorage.removeItem('username')
            localStorage.removeItem("lobbyCode");
            localStorage.removeItem("password"); 
            projectFirebaseAuth.signOut()
            
            return { ...state, user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect (() => {
        console.log("localStorage: ", localStorage.getItem('user'))
        if (currentUser == null) 
            setCurrentUser(localStorage.getItem('user'));
        
        if (localStorage.getItem('user') !== null) {
            dispatch({ type: 'LOGIN', payload: localStorage.getItem('user') })
        }
            
    }, []);

    SetUsernameFunction();
    console.log("username = ", localStorage.getItem("username"));
    console.log("user = ", currentUser)
    console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* children este componenta ce urmeaza sa fie wrap-uita */}
            { children }
        </AuthContext.Provider>
    )
}