// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { FIREBASE_KEY } from "./secret";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "ai-shopping-list-5b9dc.firebaseapp.com",
  projectId: "ai-shopping-list-5b9dc",
  storageBucket: "ai-shopping-list-5b9dc.appspot.com",
  messagingSenderId: "901846365375",
  appId: "1:901846365375:web:80d3fe6450cec22ab5420a",
  measurementId: "G-256GCCFWK5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
