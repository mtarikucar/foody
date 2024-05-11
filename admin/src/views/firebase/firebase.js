/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9pv55NoVcnMycfJvs6EpXrFTgq_N6TXU",
    authDomain: "mra-menu.firebaseapp.com",
    projectId: "mra-menu",
    storageBucket: "mra-menu.appspot.com",
    messagingSenderId: "471091906353",
    appId: "1:471091906353:web:f4e665fcb0463fe81d1210"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9pv55NoVcnMycfJvs6EpXrFTgq_N6TXU",
    authDomain: "mra-menu.firebaseapp.com",
    projectId: "mra-menu",
    storageBucket: "mra-menu.appspot.com",
    messagingSenderId: "471091906353",
    appId: "1:471091906353:web:f4e665fcb0463fe81d1210"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, storage };
