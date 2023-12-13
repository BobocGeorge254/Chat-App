import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../navigation/Navbar";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState(null);

  const userCollection = collection(db, "users");

  const writeToDatabase = async (email, username, birthday) => {
    await addDoc(userCollection, {
      email: email,
      username: username,
      birthday: birthday,
      description: "",
    });
  };

  const navigation = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        toast.success("Sign up successful!");
        writeToDatabase(email, username, birthday);
        navigation("/signin");
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };
  return (
    <div>
      <Navbar />
      <div style={{ margin: "20vh" }}>
        <h1 style={{ textAlign: "center" }}> Sign up </h1>
        <form
          onSubmit={signUp}
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

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <div style={{ display: "flex", justifyContent: "center" }}>
            <DatePicker
              selected={birthday}
              onChange={(date) => setBirthday(date)}
              placeholderText="Birthday"
              dateFormat="MM/dd/yyyy"
              className="form-control"
              style={{
                width: "20vw",
                height: "5vh",
                fontSize: "2vh",
                borderRadius: "5px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#4CAF50",
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
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
