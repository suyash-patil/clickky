import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    apiKey: "API_KEY",
    authDomain: "clickky.firebaseapp.com",
    projectId: "clickky",
    storageBucket: "clickky.appspot.com",
    messagingSenderId: "SECRET_CODE",
    appId: "YOUR_APP_ID"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};