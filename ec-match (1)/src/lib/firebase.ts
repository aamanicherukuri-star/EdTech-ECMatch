import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
// 1. Change initializeFirestore back to getFirestore
import { getFirestore } from 'firebase/firestore'; 
import firebaseConfig from '../firebase-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 2. Point it back to the default database where your Python data successfully landed
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
console.log("FIREBASE CONFIG:", firebaseConfig);
