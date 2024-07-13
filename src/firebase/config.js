// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
  apiKey: "AIzaSyAtc9nbGSU-fLssUsKfZYnILevHVC3il50",
  // apiKey: process.env.REACT_APP_FB_API_KE,
  authDomain: "reedshop-dcac2.firebaseapp.com",
  projectId: "reedshop-dcac2",
  storageBucket: "reedshop-dcac2.appspot.com",
  messagingSenderId: "40598552700",
  appId: "1:40598552700:web:0c721a0073bd38588c89f9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
//  .sendForm(
//         "service_j0sr052",
//         "template_u5p7596",
//         form.current,
//         "cFUpN1bcyWytIrgak"
//       )