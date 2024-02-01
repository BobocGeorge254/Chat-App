import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import StackNavigator from "../components/navigation/StackNavigator";
import { auth } from "../firebase";

const Post = () => {
  const location = useLocation();
  const url = location.state?.url;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const params = useParams();
  const [commentsWithUsernames, setCommentsWithUsernames] = useState([]);

  const handleChange = (e) => {
    const { value } = e.target;
    setNewComment({ ...newComment, comment: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.comment.trim() !== "") {
      try {
        await addMessageToFirestore(url, newComment.comment);

        const commentsRef = collection(db, "comments");
        const querySnapshot = await getDocs(commentsRef);
        const allComments = querySnapshot.docs.map((doc) => doc.data());
        const filteredComments = allComments.filter(
          (comment) => comment.url === url
        );
        setComments(filteredComments);
      } catch (error) {
        console.error("Error adding comment:", error);
      }

      setNewComment({ comment: "" });
    }
  };

  const addMessageToFirestore = async (url, messageContent) => {
    try {
      const commentsRef = collection(db, "comments");
      await addDoc(commentsRef, {
        url: url,
        sender: auth.currentUser.email,
        message: messageContent,
        timestamp: new Date().toISOString(),
      });
      console.log("Message added to Firestore!");
    } catch (error) {
      console.error("Error adding message to Firestore: ", error);
    }
  };

  const getUsernameFromEmail = async (email) => {
    try {
      console.log("Searching for user with email:", email);
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const username = userData.username;
        console.log("Found user. Username:", username);
        return username;
      } else {
        console.error("User document not found for email: " + email);
        return null;
      }
    } catch (error) {
      console.error("Error getting username:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentsRef = collection(db, "comments");
        const querySnapshot = await getDocs(commentsRef);
        const allComments = querySnapshot.docs.map((doc) => doc.data());
        const filteredComments = allComments.filter(
          (comment) => comment.url === url
        );
        setComments(filteredComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    const fetchCommentsWithUsernames = async () => {
      const commentsData = [];
      await Promise.all(
        comments.map(async (comment) => {
          const senderUsername = await getUsernameFromEmail(comment.sender);
          console.log("Sender:", comment.sender);
          console.log("Username:", senderUsername);
          commentsData.push({ ...comment, senderUsername });
        })
      );
      console.log("Comments with Usernames:", commentsData);
      setCommentsWithUsernames(commentsData);
    };

    fetchCommentsWithUsernames();
  }, [comments]);

  return (
    <div>
      <StackNavigator />
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <img
            src={url}
            className="img-fluid"
            alt="Post"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <h3>Comments</h3>
          {commentsWithUsernames.map((comment, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>{comment.senderUsername || "Unknown User"} : </strong>
              {comment.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div>
            <input
              type="text"
              placeholder="Your Comment"
              value={newComment.comment}
              onChange={handleChange}
              style={{ marginRight: "10px" }}
            />
            <button type="submit">Add Comment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
