import { projectFirebaseRealtime, projectFirebaseStorage } from '../firebase/config'
import { useGetTimeEpoch } from './useGetTimeEpoch';


export const useCopyQuiz= () => {
    const { getTimeEpoch } = useGetTimeEpoch();

    let quizTemplate = {
        Author: '',
        Title: '',
        Questions: [],
        isPublic: false
    };

    const copyQuiz = (quizId, quizAuthor) => {

        let username = localStorage.getItem('username');
        let newKey = getTimeEpoch();
        
        projectFirebaseRealtime.ref('Quizzes/' + quizAuthor).child(quizId).get().then((snapshot) => {
            quizTemplate.Author = username;
            quizTemplate.Title = snapshot.val().Title;
            quizTemplate.Questions = snapshot.val().Questions;
            quizTemplate.isPublic = false;
            
            projectFirebaseRealtime.ref('Quizzes/' + username + '/' + newKey).set(quizTemplate);
        })

        const ref3 = projectFirebaseStorage.ref("Images/");

        ref3.child(quizAuthor).listAll().then((result) => {
                        
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
                                        parts[2] = newKey;
                                        newPath = parts.join('/');
                                        console.log(newPath)
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
        
    }

    return { copyQuiz }
}