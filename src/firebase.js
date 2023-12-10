import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCseWgiDZhibg4z-AB4vy-1u8WcpvmYENw",
  authDomain: "frot-a74d0.firebaseapp.com",
  projectId: "frot-a74d0",
  storageBucket: "frot-a74d0.appspot.com",
  messagingSenderId: "1014655297226",
  appId: "1:1014655297226:web:28a928110a4abaea163633",
  measurementId: "G-DVVX934VZ8"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 