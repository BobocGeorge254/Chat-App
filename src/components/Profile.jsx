import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import StackNavigator from './navigation/StackNavigator';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import {v4} from 'uuid';
import { useParams } from 'react-router-dom';
import {db} from '../firebase';
import { collection, getDoc, addDoc, doc, updateDoc } from "firebase/firestore";
import logo from '../assets/profilePicture.jpg';


const Profile = () => {
 
  const [profilePicture, setProfilePicture] = useState(''); 
  const [description, setDescription] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [user, setUser] = useState(null);
  
  const params = useParams();
  const userId = params.userId;
  const imagesListRef = ref(storage, `images/${userId}`);
  const profilePicRef = ref(storage, `images/${userId}/profilepic`);

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const storageRef = ref(storage, `images/${userId}/profilepic/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        console.log('Profile picture uploaded successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
     if(imageUpload == null)  return;
     const imageRef = ref(storage, `images/${userId}/${imageUpload.name + v4()}`);
     uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            setImageList((prev) => [...prev, url]);
        });
     });
  };

  const handleDescriptionSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "users", userId), {
      description: description
    });
  }; 

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const profilePicList = await listAll(profilePicRef);
        const profilePicURLs = await Promise.all(profilePicList.items.map((itemRef) => getDownloadURL(itemRef)));

        const userRef = doc(db, 'users', userId); 
        const userSnapshot = await getDoc(userRef);
        setUser(userSnapshot.data());
        setDescription(userSnapshot.data().description);
        const res = await listAll(imagesListRef);
        const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
        setImageList(urls);
        if (profilePicURLs.length > 0) {
          setProfilePicture(profilePicURLs[0]); // Assuming only one profile picture is uploaded
        }
        else {
          setProfilePicture(logo);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
  };

  fetchImages();
}, []);

   return (
    <div className="container mt-4 mb-4 p-3 d-flex justify-content-center" style={{maxWidth: "40vw"}}>
      <div className="card p-4">
        <div className="profile-section">
          <div className="image d-flex flex-column justify-content-center align-items-center">
            <h3>Profile Picture</h3>
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
                  style={{ width: '100px', height: '100px' }}
                  alt="Profile"
                />
              )}
            </div>
            {/*<h4>{user.username}</h4> <p>{user.email}</p>*/}
            
            {/* Other profile information */}
          </div>
        </div>

        <div className="profile-section text-center">
          <h3 className="text-center">Description</h3>
          <Form onSubmit={handleDescriptionSubmit}>
            <Form.Group controlId="description">
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ textAlign: 'center' }}
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Update Description
            </Button>
          </Form>
        </div>

        <hr className="new1" />

        <div className="photos-section mt-4">
          <h3 className="text-center">Photos</h3>
          <div className="d-flex flex-wrap justify-content-center">
            {imageList.length === 0 ? (
              <p className="text-center">No posts yet</p>
            ) : (
              imageList.map((url) => (
                <div key={url} className="m-2" style={{ maxWidth: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                  <img src={url} className="img-fluid" alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))
            )}
          </div>
          <div className="mt-3 text-center">
            <input
              type="file"
              onChange={(event) => setImageUpload(event.target.files[0])}
              className="form-control"
            />
            <Button className="mt-2" onClick={handlePhotoUpload} variant="primary">
              Upload Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};




export default Profile;
