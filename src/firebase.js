import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0_7O8928RIQkDfIHQvxEEfuyDMCpeejM",
  authDomain: "frontend-aad33.firebaseapp.com",
  projectId: "frontend-aad33",
  storageBucket: "frontend-aad33.appspot.com",
  messagingSenderId: "858929621881",
  appId: "1:858929621881:web:04e3e8f6a97a927dff1da8",
  measurementId: "G-1X3PWEJVHL"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 