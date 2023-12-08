import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../navigation/Navbar";
import { useNavigate, useLocation } from "react-router-dom";


const SignIn = ({getStatus, getEmail}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigate();
    const location = useLocation();
    
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log(userCredentials);
                toast.success("Succesful! Happy chatting! :)");
                navigation("/UserList", { state: { userEmail : email } });

            })
            .catch((error) => {
                console.log(error);
                toast.error("Something went wrong!");
            })

    }
    return (
        <div>
            <Navbar />
            <div style={{margin: "20vh"}}>
                
                <h1 style={{ textAlign: "center" }}> Sign in </h1>
                <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: "1.5vh"}}>
                    
                    <input type = "text" 
                        placeholder = "Email" 
                        value = {email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            display: "flex",
                            margin: "auto",
                            justifyContent: "center",
                            width: "20vw",
                            height: "5vh",
                            fontSize: "2vh",
                            borderRadius: "5px",

                        }}>
                    </input>

                    <input type = "password" 
                        placeholder = "Password" 
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        style={{
                            display: "flex",
                            margin: "auto",
                            justifyContent: "center",
                            width: "20vw",
                            height: "5vh",
                            fontSize: "2vh",
                            borderRadius: "5px",
                        }}>
                    </input>

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
}

export default SignIn;