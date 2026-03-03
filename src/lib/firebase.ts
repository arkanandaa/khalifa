import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWvZxwUNuNt9psjOTiSPur7NmOZDyx3-c",
  authDomain: "kapa-portfolio.firebaseapp.com",
  projectId: "kapa-portfolio",
  storageBucket: "kapa-portfolio.firebasestorage.app",
  messagingSenderId: "956664251450",
  appId: "1:956664251450:web:3b9dccef8261e052d3a103"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
