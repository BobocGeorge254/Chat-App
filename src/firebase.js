import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB2yte6zx69f-LvNUwRRtpF592PrnHyFVM",
  authDomain: "react-21223.firebaseapp.com",
  projectId: "react-21223",
  storageBucket: "react-21223.appspot.com",
  messagingSenderId: "545853337380",
  appId: "1:545853337380:web:1b95b3eff64fb6f9390db1",
  measurementId: "G-0MK1EBE8GZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);