import { projectFirebaseAuth, projectFirebaseRealtime } from '../firebase/config'
import { useState } from 'react'


export const useDeleteAccount = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const deleteAccount = async () => {
        setIsPending(true);
        setError(null)
           
        // await projectFirebaseAuth.currentUser
        // .delete()
        // .then(() => console.log("User deleted"))
        // .catch((error) => setError(error));

        // projectFirebaseRealtime.ref("History/Host").child(localStorage.getItem("username"))
        // .remove()
        // .then(() => console.log("History deleted"))
        // .catch((error) => setError(error));

        // projectFirebaseRealtime.ref("Quizzes/").child(localStorage.getItem("username"))
        // .remove()
        // .then(() => console.log("Quizzes deleted"))
        // .catch((error) => setError(error));

        // const ref = projectFirebaseRealtime.ref("Users/");
        // ref.once("value", (snapshot) => {
        //     if (snapshot.exists) {
        //         snapshot.forEach((childSnapshot) => {
        //             if (childSnapshot.key !== "noUsers" && childSnapshot.val().username === localStorage.getItem("username") && childSnapshot.val().email === localStorage.getItem("user")) {
        //                 projectFirebaseRealtime.ref("Users/").child(childSnapshot.key)
        //                 .remove()
        //                 .then(() => console.log("User deleted"))
        //                 .catch((error) => setError(error));

        //                 projectFirebaseRealtime.ref('Users/noUsers').set(firebase.database.ServerValue.increment(-1));
        //             }
        //         })
        //     }
        // })

        setIsPending(false);

    }

    return { deleteAccount, isPending, error}
}