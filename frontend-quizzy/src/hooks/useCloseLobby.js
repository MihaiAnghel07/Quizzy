import { projectFirebaseRealtime } from '../firebase/config'


export const useCloseLobby = () => {

    const closeLobby = (lobbyCode) => {
        
        projectFirebaseRealtime.ref('Lobbies/' + lobbyCode).remove();
                  
    }

    return { closeLobby }
}