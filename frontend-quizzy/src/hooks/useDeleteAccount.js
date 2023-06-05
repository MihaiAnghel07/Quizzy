import { projectFirebaseAuth, projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useState } from 'react'
import firebase from "firebase/app";
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';


export const useDeleteAccount = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
    let navigate = useNavigate();

    const deleteAccount = async () => {
        setIsPending(true);
        setError(null)

        projectFirebaseRealtime.ref("History/host").child(localStorage.getItem("username"))
        .remove()
        .then(() => console.log("History deleted"))
        .catch((error) => {setError(error); console.log("Error: ", error)});

        projectFirebaseRealtime.ref("Quizzes/").child(localStorage.getItem("username"))
        .remove()
        .then(() => console.log("Quizzes deleted"))
        .catch((error) => {setError(error); console.log("Error: ", error)});

        projectFirebaseRealtime.ref("Statistics/host/").child(localStorage.getItem("username"))
        .remove()
        .then(() => console.log("Statistics deleted"))
        .catch((error) => {setError(error); console.log("Error: ", error)});

        const ref = projectFirebaseRealtime.ref("Users/");
        ref.once("value", (snapshot) => {
            if (snapshot.exists) {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== "noUsers" && childSnapshot.val().username === localStorage.getItem("username") && childSnapshot.val().email === localStorage.getItem("user")) {
                        projectFirebaseRealtime.ref("Users/").child(childSnapshot.key)
                        .remove()
                        .then(() => console.log("User deleted from local database"))
                        .catch((error) => {setError(error); console.log("Error: ", error)});

                        projectFirebaseRealtime.ref('Users/noUsers').set(firebase.database.ServerValue.increment(-1));
                    }
                })
            }
        })
        // TODO: ttrebuie sa sterg fiecare poza individual, prin referinta, nu pot sterge direct un folder..
        projectFirebaseStorage.ref("Images/").child(localStorage.getItem("username") + '/')
        .delete()
        .then(() => console.log("Images storage is clean"))
        .catch((error) => {setError(error); console.log("Error: ", error)});

        projectFirebaseStorage.ref("History/host/").child(localStorage.getItem("username") + '/')
        .delete()
        .then(() => console.log("History storage is clean"))
        .catch((error) => {setError(error); console.log("Error: ", error)});

        await projectFirebaseAuth.currentUser
        .delete()
        .then(() => console.log("User deleted"))
        .catch((error) => {setError(error); console.log("Error: ", error); alert(error)});

        dispatch({ type: 'LOGOUT' })
        navigate('/login', {replace:true})

        setIsPending(false);

    }

    return { deleteAccount, isPending, error}
}