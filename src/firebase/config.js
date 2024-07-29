// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCSz61AM0EIjpC-eAeYrJxctketi_FuxaM",
  authDomain: "hasa-wears.firebaseapp.com",
  projectId: "hasa-wears",
  storageBucket: "hasa-wears.appspot.com",
  messagingSenderId: "654279618395",
  appId: "1:654279618395:web:9107e15bf0e3d1458c347e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);