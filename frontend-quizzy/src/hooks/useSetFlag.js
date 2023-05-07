import { projectFirebaseRealtime } from '../firebase/config'
import firebase from "firebase/app";


export const useSetFlag = () => {

    const setFlag = (lobbyCode, questionId) => {

        //const ref = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode + '/');

        // //add question image, if exists
        // if (imageUpload !== null && imageUpload.length !== 0) { 
        //     console.log(imageUpload)
        //     let ref = projectFirebaseStorage.ref('Images/');
        //     ref.child(username + '/' + quizKey + '/' + 'Questions/' + newKey + '/' + imageUpload[0].name).put(imageUpload[0]).then((snapshot) => {
        //         console.log("Uploading state: " + snapshot.state);
        //         console.log("File uploaded!")
        //     });
        // }

    }

    return { setFlag }
}