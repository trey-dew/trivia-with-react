import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const test = import.meta.env.VITE_FIREBASE_API_KEY;
const projectTest = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Your Firebase configuration
const firebaseConfig = {
    apiKey:"import.meta.env.VITE_FIREBASE_API_KEY",
    authDomain:"import.meta.env.VITE_FIREBASE_AUTH_DOMAIN",
    projectId:"vine-l",
    storageBucket:"import.meta.env.VITE_FIREBASE_STORAGE_BUCKET",
    messagingSenderId:"import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID",
    appId:"import.meta.env.VITE_FIREBASE_APP_ID",
    measurementId:"import.meta.env.VITE_FIREBASE_MEASUREMENT_ID"
  };

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// console.log('Project ID:', projectTest);
// console.log('API_Key:', test);
// console.log(import.meta.env);


export { auth, db, storage };
