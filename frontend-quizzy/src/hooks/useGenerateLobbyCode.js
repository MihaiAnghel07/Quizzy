import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from "react";


export const useGenerateLobbyCode = () => {

    const existLobbyCode = (randomLobbyCode) => {
        let exist = false;
        const ref = projectFirebaseRealtime.ref('Lobbies');
        ref.child(randomLobbyCode).get().then((snapshot) => {
            if (snapshot.exists()) {
                exist = true;
            } else {
                exist = false;
            }
        })

        return exist;

    }

    const generateLobbyCode = () => {
        let randomLobbyCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        while (existLobbyCode(randomLobbyCode)) {
            randomLobbyCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        }

        return randomLobbyCode;
 
    }

    return { generateLobbyCode }
}
