import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/database";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDnff6EL8Eoyk-P2rRd9N76H1TH4u2hm-8",
    authDomain: "poolet-2153a.firebaseapp.com",
    projectId: "poolet-2153a",
    storageBucket: "poolet-2153a.appspot.com",
    messagingSenderId: "1042469510348",
    appId: "1:1042469510348:web:74f3c588ee6930ec283669"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;