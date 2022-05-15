// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNmLrYVPYYQL9QwMY5vMRCt5lCUPFolqk",
    authDomain: "house-market-7ebe1.firebaseapp.com",
    projectId: "house-market-7ebe1",
    storageBucket: "house-market-7ebe1.appspot.com",
    messagingSenderId: "900217892418",
    appId: "1:900217892418:web:67dd7cfe028ede374f87db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();