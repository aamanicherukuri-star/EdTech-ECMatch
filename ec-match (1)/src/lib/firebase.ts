import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeL1MOmME0XnsoLtGdDzDj_-mHzBdtM-I",
  authDomain: "ec-match.firebaseapp.com",
  projectId: "ec-match",
  storageBucket: "ec-match.firebasestorage.app",
  messagingSenderId: "294005246058",
  appId: "1:294005246058:web:21ea925c762cb2a5556213",
  measurementId: "G-VCK9HZZV34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

console.log("FIREBASE CONFIG:", firebaseConfig);