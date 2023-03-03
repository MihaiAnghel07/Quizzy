import firebase from "firebase/app";
import 'firebase/firebase-auth'
import 'firebase/firebase-database'

const firebaseConfig = {
    apiKey: "AIzaSyBWThgMyzV7IeWuUNah8OusAS0tf9zlQ2s",
    authDomain: "quizzy-58a7b.firebaseapp.com",
    databaseURL: "https://quizzy-58a7b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quizzy-58a7b",
    storageBucket: "quizzy-58a7b.appspot.com",
    messagingSenderId: "891932150203",
    appId: "1:891932150203:web:7e2e6d5bf9296a42c2dc9e"
  };

  // init firebase
  firebase.initializeApp(firebaseConfig)

  // init services
  const projectFirebaseRealtime = firebase.database()
  const projectFirebaseAuth = firebase.auth()

  export {projectFirebaseRealtime, projectFirebaseAuth}
