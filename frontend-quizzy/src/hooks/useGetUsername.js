import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";


export const useGetUsername = () => {
    const [username, setUsername] = useState(null);

    const getUsername = () => {

        const ref = projectFirebaseRealtime.ref('Users/');  
        ref.once('value', (snapshot) => {
            snapshot.forEach(snapshotChild => {
                if (snapshotChild.val().email === localStorage.getItem('user')) {
                    setUsername(snapshotChild.val().username);
                }
            });
        })
        
        return username;
    }

    return { getUsername }
}