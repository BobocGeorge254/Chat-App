import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2TGa7UB35PxVZWV-pYHXiKyNupdtX7tQ",
  authDomain: "frontend-app-3ca1b.firebaseapp.com",
  projectId: "frontend-app-3ca1b",
  storageBucket: "frontend-app-3ca1b.appspot.com",
  messagingSenderId: "715806634984",
  appId: "1:715806634984:web:bb29f47401c516966dea5d",
  measurementId: "G-XF1HM5QV57"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);