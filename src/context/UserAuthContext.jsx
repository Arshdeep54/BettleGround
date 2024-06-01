import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const userAuthContext = createContext({
  user: null,
  logIn: () => Promise.reject(),
  signUp: () => Promise.reject(),
  logOut: () => Promise.reject(),
  googleSignIn: () => Promise.reject(),
});

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  async function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  async function signUp(email, password, displayName) {
    try{const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      return updateProfile(user, { displayName: displayName }).then(() => {
        return userCredential;
      });
    }
    return userCredential;
  }catch(error){
    console.log(error.message);
    throw new Error(error.message);
  }}
  
  function logOut() {
    return signOut(auth);
  }
  
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
