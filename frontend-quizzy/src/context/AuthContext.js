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
            if (localStorage.getItem('user') == null) {
                localStorage.setItem('user', action.payload.email)
            }
            return { ...state, user: localStorage.getItem('user') }
        case 'LOGOUT' :
            localStorage.removeItem('user')
            localStorage.removeItem('username')
            localStorage.removeItem("lobbyCode");
            localStorage.removeItem("password"); 
            localStorage.removeItem("uid");
            localStorage.removeItem("currentQuestionCount");
            localStorage.removeItem("quizDuration");
            sessionStorage.removeItem("quizOnGoing");
            localStorage.removeItem("alertTime");
            localStorage.removeItem("selectedButton");
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
        if (currentUser == null) 
            setCurrentUser(localStorage.getItem('user'));
        
        if (localStorage.getItem('user') !== null) {
            dispatch({ type: 'LOGIN', payload: localStorage.getItem('user') })
        }
            
    }, []);

    SetUsernameFunction();
    console.log("user = ", currentUser)
    console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* children este componenta ce urmeaza sa fie wrap-uita */}
            { children }
        </AuthContext.Provider>
    )
}