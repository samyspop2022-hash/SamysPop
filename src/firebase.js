import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyRp5tdUKzo6jIVYqgk93S18_xFAOw402fw",
  authDomain: "samys-pop.firebaseapp.com",
  projectId: "samys-pop",
  storageBucket: "samys-pop.appspot.com",
  messagingSenderId: "802512638598",
  appId: "1:802512638598:web:269287a8d3acdd9cdbb707",
  measurementId: "G-PM27MX2X0E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
