import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../navigation/Navbar";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const SignIn = ({ getStatus, getEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      let userId = "";
      querySnapshot.forEach((doc) => {
        userId = doc.id;
      });

      const user = userCredentials.user;
      const idToken = await getIdToken(user, true);
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        idToken: idToken,
      });
      navigation(`/userlist/${idToken}/${userId}`, {
        state: { userEmail: email },
      });
      toast.success("Successful! Happy chatting! :)");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ margin: "20vh" }}>
        <h1 style={{ textAlign: "center" }}> Sign in </h1>
        <form
          onSubmit={signIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              width: "20vw",
              height: "5vh",
              fontSize: "2vh",
              borderRadius: "5px",
            }}
          ></input>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              width: "20vw",
              height: "5vh",
              fontSize: "2vh",
              borderRadius: "5px",
            }}
          ></input>

          <button
            type="submit"
            style={{
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#2CAF50",
              border: "none",
              color: "white",
              width: "20vw",
              height: "5vh",
              fontSize: "2vh",
              borderRadius: "5px",
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              transition: "0.3s",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
