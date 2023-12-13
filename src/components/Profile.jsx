import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import StackNavigator from "./navigation/StackNavigator";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  getStorage,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import logo from "../assets/profilePicture.jpg";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imageListRef, setImageListRef] = useState([]);
  const [username, setUsername] = useState("");

  const params = useParams();
  const [profileId, setProfileId] = useState(params.profileId);
  const [userId, setUserId] = useState(params.userId);
  const storage = getStorage();
  const navigation = useNavigate();

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const storageRef = ref(
        storage,
        `images/${profileId}/profilepic/${file.name}`
      );
      try {
        await uploadBytes(storageRef, file);
        console.log("Profile picture uploaded successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
    if (imageUpload == null) return;

    const uniqueIdentifier = imageUpload.name + v4();
    const imageRef = ref(storage, `images/${profileId}/${uniqueIdentifier}`);
    setImageListRef((prevRefs) => [...prevRefs, uniqueIdentifier]);
    //console.log(imageListRef);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };

  const handleDeletePhoto = async (index) => {
    const updatedImageList = [...imageList];
    const deletedImageUrl = updatedImageList.splice(index, 1)[0];
    setImageList(updatedImageList);
    console.log(deletedImageUrl);
    try {
      const extractedPath = extractPathFromUrl(deletedImageUrl);
      console.log(extractedPath);
      const desertRef = ref(storage, `images/${profileId}/${extractedPath}`);
      deleteObject(desertRef)
        .then(() => {
          console.log("Deleted succesfuly!");
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(imageListRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageList([...updatedImageList, deletedImageUrl]);
    }
  };

  const extractPathFromUrl = (url) => {
    const startText = "%2F"; // The start of the path in your URL
    const endText = "?alt=media"; // The end of the path in your URL

    const firstIndex = url.indexOf(startText);
    const secondIndex = url.indexOf(startText, firstIndex + 1); // Find the second occurrence

    const endIndex = url.indexOf(endText);

    if (secondIndex !== -1 && endIndex !== -1) {
      return url.substring(secondIndex + startText.length, endIndex);
    }
    return null;
  };

  const handleDescriptionSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "users", profileId), {
      description: description,
    });
  };

  const redirectToPost = ({ url }) => {
    navigation(
      `/post/${params.idToken}/${params.userId}/${
        params.profileId
      }/${extractPathFromUrl(url)}`,
      { state: { url: url } }
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesListRef = ref(storage, `images/${params.profileId}`);
        const profilePicRef = ref(
          storage,
          `images/${params.profileId}/profilepic`
        );

        const profilePicList = await listAll(profilePicRef);
        const profilePicURLs = await Promise.all(
          profilePicList.items.map((itemRef) => getDownloadURL(itemRef))
        );

        const userRef = doc(db, "users", params.profileId);
        const userSnapshot = await getDoc(userRef);

        setUserId(params.userId);
        setProfileId(params.profileId);

        setDescription(userSnapshot.data().description);
        setEmail(userSnapshot.data().email);
        setUsername(userSnapshot.data().username);

        const res = await listAll(imagesListRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImageList(urls);
        if (profilePicURLs.length > 0) {
          setProfilePicture(profilePicURLs[0]); // Assuming only one profile picture is uploaded
        } else {
          setProfilePicture(logo);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [params]);

  return (
    <div>
      <StackNavigator />
      <div
        className="container mt-4 mb-4 p-3 d-flex justify-content-center"
        style={{ maxWidth: "40vw" }}
      >
        <div className="card p-4">
          <div className="profile-section">
            <div className="image d-flex flex-column justify-content-center align-items-center">
              {userId === profileId ? (
                <div className="image d-flex flex-column justify-content-center align-items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="form-control"
                  />
                  {profilePicture && (
                    <img
                      src={profilePicture}
                      className="img-fluid mt-3 rounded-circle"
                      style={{ width: "100px", height: "100px" }}
                      alt="Profile"
                    />
                  )}
                </div>
              ) : (
                profilePicture && (
                  <div className="image d-flex flex-column justify-content-center align-items-center">
                    <img
                      src={profilePicture}
                      className="img-fluid mt-3 rounded-circle"
                      style={{ width: "100px", height: "100px" }}
                      alt="Profile"
                    />
                  </div>
                )
              )}
              <h3>{username}</h3>
              <p>{email}</p>
            </div>
          </div>

          <div className="profile-section text-center">
            <Form onSubmit={handleDescriptionSubmit}>
              <Form.Group controlId="description">
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ textAlign: "center" }}
                />
              </Form.Group>
              {userId === profileId && (
                <div>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ marginTop: "10px" }}
                  >
                    Update Description
                  </Button>
                </div>
              )}
            </Form>
          </div>

          <hr className="new1" />

          <div className="photos-section mt-4">
            <div className="d-flex flex-wrap justify-content-center">
              {imageList.length === 0 ? (
                <p className="text-center">No posts yet</p>
              ) : (
                imageList.map((url, index) => (
                  <div
                    key={url}
                    className="m-2"
                    style={{
                      position: "relative",
                      maxWidth: "200px",
                      maxHeight: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={url}
                      onClick={() => redirectToPost({ url })}
                      className="img-fluid"
                      alt="Post"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {userId === profileId && (
                      <button
                        className="btn btn-danger btn-sm delete-button"
                        onClick={() => handleDeletePhoto(index)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            {userId === profileId && (
              <div className="mt-3 text-center">
                <input
                  type="file"
                  onChange={(event) => setImageUpload(event.target.files[0])}
                  className="form-control"
                />
                <Button
                  className="mt-2"
                  onClick={handlePhotoUpload}
                  variant="primary"
                >
                  Upload Photo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
