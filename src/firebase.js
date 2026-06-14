import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBp5tdUKzo6jIVYqgk935l8_xFAOw4O2fw",
  authDomain: "samys-pop.firebaseapp.com",
  projectId: "samys-pop",
  storageBucket: "samys-pop.firebasestorage.app",
  messagingSenderId: "802512638598",
  appId: "1:802512638598:web:269287a8d3acdd9cdbb707",
  measurementId: "G-PM27MX2X0E"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos Firestore (esto es lo que necesitamos para guardar pedidos)
export const db = getFirestore(app);