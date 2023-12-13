import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  where,
  getDocs
} from "firebase/firestore";
import StackNavigator from "../components/navigation/StackNavigator";

const addMessageToFirestore = async (url, userId, messageContent) => {
  try {
    const commentsRef = collection(db, "comments");
    await addDoc(commentsRef, {
      url: url,
      sender: userId,
      message: messageContent,
      timestamp: new Date().toISOString(),
    });
    console.log("Message added to Firestore!");
  } catch (error) {
    console.error("Error adding message to Firestore: ", error);
  }
};

const Post = () => {
  const location = useLocation();
  const url = location.state?.url;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const params = useParams();

  const handleChange = (e) => {
    const { value } = e.target;
    setNewComment({ ...newComment, comment: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.comment.trim() !== "") {
      console.log(newComment.comment);
      addMessageToFirestore(url, params.userId, newComment.comment);
      setComments([...comments, newComment]); // Update comments locally
      setNewComment({ comment: "" }); // Clear input field
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
          }}
        >
          <h3>Comments</h3>
          {comments.map((comment, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>{comment.sender} : </strong>
              {comment.message}
            </div>
          ))}
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
    </div>
  );
};

export default Post;
