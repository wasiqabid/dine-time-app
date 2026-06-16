// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvNtltTz7OE-zJKFYfe53bbcm8rSmqGYY",
    authDomain: "dine-time-c512d.firebaseapp.com",
    projectId: "dine-time-c512d",
    storageBucket: "dine-time-c512d.firebasestorage.app",
    messagingSenderId: "100632308824",
    appId: "1:100632308824:web:adcbd7a1b8a110f9526e2d",
    measurementId: "G-70PQWHEPM9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
