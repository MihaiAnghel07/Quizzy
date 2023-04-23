import { Navigate, useNavigate } from 'react-router-dom';
import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from "react";


export const useCloseLobby = () => {

    const [error, setError] = useState(null)

    const closeLobby = (lobbyCode) => {
        
        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode).remove();
                  
    }

    return { closeLobby }
}