import { projectFirebaseRealtime } from '../firebase/config'


export const useLoadingLobbyTemplate = () => {

    const loadLobbyTemplateToDatabase = (lobbyTemplate) => { 
        projectFirebaseRealtime.ref('Lobbies/' + lobbyTemplate.code).set(lobbyTemplate);
    }

    return { loadLobbyTemplateToDatabase }
}