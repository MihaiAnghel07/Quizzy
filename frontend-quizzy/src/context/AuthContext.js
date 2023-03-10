import { createContext, useEffect, useReducer, useState } from "react";
import { projectFirebaseAuth } from '../firebase/config';


export const AuthContext = createContext()

export const authReducer = (state, action) => {

    switch (action.type) {
        case 'LOGIN' :
            console.log("SET: ", action.payload)
            sessionStorage.setItem('user', action.payload)
            console.log("GET: ", sessionStorage.getItem('user'))
            return { ...state, user: action.payload }
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
        console.log("AAAAAAAAAAAAAAAAAA")
        //console.log(projectFirebaseAuth.currentUser);

        // if (projectFirebaseAuth.currentUser) {
        //     dispatch({ type: 'LOGIN', payload: localStorage.getItem('user') })
        //     localStorage.setItem('user', JSON.stringify(projectFirebaseAuth.currentUser))
        // } else {
        //     localStorage.setItem('user', null)
        // }
        // projectFirebaseAuth.currentUser ? localStorage.setItem('user', projectFirebaseAuth.currentUser) : localStorage.setItem('user', null)
        console.log("localStorage: ", sessionStorage.getItem('user'))
        if (sessionStorage.getItem('user') !== null) {
            dispatch({ type: 'LOGIN', payload: sessionStorage.getItem('user') })
        }
            // setCurrentUser(localStorage.getItem('user'))
        //localStorage.setItem('user', projectFirebaseAuth.currentUser)
        //dispatch({ type: 'LOGIN', payload: localStorage.getItem('user') })
     
        // projectFirebaseAuth.onAuthStateChanged((user) => {
        //     setCurrentUser(user)
        //     //setDispatch(user)
        //     //setState(true)
        //     dispatch({ type: 'LOGIN', payload: user })
        // });
    }, []);

    
    //console.log("user = ", currentUser)
    console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* children este componenta ce urmeaza sa fie wrap-uita */}
            { children }
        </AuthContext.Provider>
    )
}