import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/database";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDMxUaTU56QRbZgu5P5GNiCaYKg168xOGc",
  authDomain: "keymaster-df92e.firebaseapp.com",
  projectId: "keymaster-df92e",
  storageBucket: "keymaster-df92e.appspot.com",
  messagingSenderId: "397167121934",
  appId: "1:397167121934:web:6a407953e631793bf28e5f",
  databaseURL: "https://keymaster-df92e-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;