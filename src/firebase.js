import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBASWoGuUjGkMoeFaQ33Rsk0UkjoYbsjQ",
  authDomain: "boboc-srl.firebaseapp.com",
  projectId: "boboc-srl",
  storageBucket: "boboc-srl.appspot.com",
  messagingSenderId: "114796245853",
  appId: "1:114796245853:web:23a05744714b6abc94eeb4",
  measurementId: "G-VYECN54Z39"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 