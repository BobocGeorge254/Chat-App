import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { collection, addDoc, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Button from "react-bootstrap/Button";
import StackNavigator from "../components/navigation/StackNavigator";
import UserList from "./UserList";

const Chat = () => {
  const [gUserEmail, setUserEmail] = useState("");
  const [gReceiverEmail, setReceiverEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  const params = useParams();
  const userId = params.userId;
  const receiverId = params.recipientId;

  const messageCollection = collection(db, "messages");
  const userCollection = collection(db, "users");

  const getSenderAndReceiverEmails = async () => {
    const userIdDoc = await getDoc(doc(userCollection, userId));
    const receiverIdDoc = await getDoc(doc(userCollection, receiverId));
    const userEmail = userIdDoc.data().email;
    const receiverEmail = receiverIdDoc.data().email;
    return [userEmail, receiverEmail];
  };

  const fetchMessages = async () => {
    try {
      const [userEmail, receiverEmail] = await getSenderAndReceiverEmails();
      console.log("testing muie:  ", messages.length, userEmail, receiverEmail);
      setUserEmail(userEmail);
      setReceiverEmail(receiverEmail);
      const querySnapshot = await getDocs(messageCollection);
      const allMessages = querySnapshot.docs.map((doc) => doc.data());

      const filteredMessages = allMessages.filter(
        (msg) =>
          (msg.sender === userEmail && msg.receiver === receiverEmail) ||
          (msg.sender === receiverEmail && msg.receiver === userEmail)
      );

      const orderedMessages = filteredMessages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      if (orderedMessages.length > 0) setMessages(orderedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getSenderAndReceiverEmails().then((u, r) => {
      setUserEmail(u);
      setReceiverEmail(r);
    });

    const interval = setInterval(fetchMessages, 1000);
    fetchMessages();
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const [userEmail, receiverEmail] = await getSenderAndReceiverEmails();
    setUserEmail(userEmail);
    setReceiverEmail(receiverEmail);
    if (message.trim() !== "") {
      try {
        await addDoc(messageCollection, {
          sender: userEmail,
          receiver: receiverEmail,
          content: message,
          timestamp: new Date().toISOString(),
        });
        setMessage("");
        fetchMessages();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <StackNavigator />
      <h1
        style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}
      >
        Chat with {gReceiverEmail}
      </h1>
      <div
        style={{
          height: "70vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          marginLeft: "5vw",
          marginRight: "5vw",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === gUserEmail ? "right" : "left",
            }}
          >
            <p
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:
                  msg.sender === gUserEmail ? "#DCF8C6" : "#ACDFFB",
                maxWidth: "60%",
                wordWrap: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            padding: "8px",
            width: "60%",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <Button variant="primary" type="submit">
          Send
        </Button>{" "}
      </form>
    </div>
  );
};

export default Chat;
