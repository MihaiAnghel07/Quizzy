import { projectFirebaseRealtime, projectFirebaseStorage, projectFirebaseAuth } from '../firebase/config'
import { useState } from 'react'


export const useEditAccount = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [noUsers, setNoUsers] = useState(-1);

    const editAccount = async (username, email, password) => {
        setIsPending(true);
        setError(null)

        const ref = projectFirebaseRealtime.ref("Users/");
        const ref2 = projectFirebaseRealtime.ref("Quizzes/");
        const ref3 = projectFirebaseStorage.ref("Images/");

        await ref.once("value", (snapshot) => {
            if (snapshot.exists()) {
                setNoUsers(snapshot.val().noUsers)
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== 'noUsers') {
                        if (childSnapshot.val().username === username && childSnapshot.val().email !== localStorage.getItem("user")) {
                            setError("This username already exists")
                        }
                    }
                })
            }
        })

        if (error === null) {
            await ref.once("value", (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.key !== 'noUsers') {
                            if (childSnapshot.val().email === email && email !== localStorage.getItem("user")) {
                                setError("This email is already associated with another account")
                            }
                        }
                    })
                }
            });
        }

        // daca localstorage.lobbycode exista modificare host in structura de lobbies din firebase
        
        
        if (error === null) {

            // update 'Users' entry
            await ref.once("value", (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        if (childSnapshot.val().email === localStorage.getItem("user") && childSnapshot.val().username === localStorage.getItem("username")) {
                            projectFirebaseRealtime.ref("Users/" + childSnapshot.key).set({'email': email, 'username': username});
                        }
                    })
                }
            });

            // update 'Quizzes' entry
            ref2.child(localStorage.getItem("username")).once('value').then(function(snapshot) {
                let data = snapshot.val();
                for (const i in data) {
                    data[i].Author = username;
                }
                let update = {};
                update[localStorage.getItem("username")] = null;
                update[username] = data;
                ref2.update(update);
            });
            ref2.child(localStorage.getItem("username")).remove();

            // update storage
            ref3.child(localStorage.getItem("username")).listAll().then((result) => {
                        
                result.prefixes.forEach((itemRef2) => {
                    itemRef2.listAll().then((result3) => {
                        
                        result3.prefixes.forEach((itemRef3) => {
                            itemRef3.listAll().then((result4) => {
                            
                                result4.prefixes.forEach((itemRef4) => {
                                    itemRef4.listAll().then((result5) => {

                                        result5.items.forEach(async (itemRef5) => {
                                            
                                            const parts = itemRef5.fullPath.split('/');
                                            let newPath = null;
                                            if (parts.length < 2) {
                                              newPath = itemRef5.fullPath;
                                            }

                                            parts[1] = username;
                                            newPath = parts.join('/');
                                    
                                            const destinationRef = projectFirebaseStorage.ref(newPath);
                                            
                                            itemRef5.getDownloadURL()
                                            .then((url) => {
                                                return fetch(url);
                                            })
                                            .then((response) => {
                                                return response.blob();
                                            })
                                            .then((blob) => {
                                                return destinationRef.put(blob);
                                            })
                                            .then(() => {
                                                console.log("Image copied successfully!");
                                                itemRef5.delete();
                                            })
                                            .catch((error) => {
                                                console.error("EROARE0:" + error);
                                            });

                                        })     
                                    })
                                })    
                            })
                        })  
                    })       
                })

            }).catch((err)=> {
                console.log("EROARE:" + err)
            })
            

            projectFirebaseAuth.signInWithEmailAndPassword(localStorage.getItem("user"), localStorage.getItem("password"))
            .then(function(userCredential) {
                userCredential.user.updateEmail(email)
                // userCredential.user.updatePassword(password)
            })
            .catch(err => {
                setError(err)
            })

            localStorage.setItem("user", email)
            localStorage.setItem("username", username)
            
        }


        setIsPending(false);

    }

    return { editAccount, isPending, error}
}