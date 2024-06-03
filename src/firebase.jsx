import firebase from "firebase";
/*
const firebaseConfig = {
  apiKey: "AIzaSyClvkvGNDw2YtNuVUz7lMo2bgaWs4jJ-D8",
  authDomain: "campushub-d98bd.firebaseapp.com",
  projectId: "campushub-d98bd",
  storageBucket: "campushub-d98bd.appspot.com",
  messagingSenderId: "643264223185",
  appId: "1:643264223185:web:f2d86a18930fdd0f3e32f0",
};*/

const firebaseConfig = {
  apiKey: "AIzaSyBOP21xXjFC_FClCf0A9e1Z4F5BwiAmpow",
  authDomain: "campushub-1c470.firebaseapp.com",
  projectId: "campushub-1c470",
  storageBucket: "campushub-1c470.appspot.com",
  messagingSenderId: "985073052328",
  appId: "1:985073052328:web:6f7cc0e0e2001260aeb09d",
  measurementId: "G-W3XZWWGLME",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
