import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import StackNavigator from './navigation/StackNavigator';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import {v4} from 'uuid';
import { useParams } from 'react-router-dom';
import {db} from '../firebase';
import { collection, getDoc, addDoc, doc, updateDoc } from "firebase/firestore";

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
      } catch (error) {
        console.error('Error fetching images:', error);
      }
  };

  fetchImages();
}, []);

  return (
    <div>
      <StackNavigator />
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="form-control"
              />
               {profilePicture && (
                 <img
                  src={profilePicture}
                  alt="Profile"
                  className="img-fluid mt-3 rounded-circle"
                  style={{ width: '80px', height: '80px', display: 'flex', margin: 'auto'}}
                />
              )}

              <Form onSubmit={handleDescriptionSubmit}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update Description
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={8}>
            <Row>
              {imageList.length === 0 ? (
                <Col className="text-center">No posts yet</Col>
              ) : (
                imageList.map((url) => (
                    <img src={url}  className="img-fluid"
                    style={{ width: '20vw', height: '30vh' }} />
                ))
              )}
              <Col sm={4} className="mb-3">
                <div className="mt-3">
                  <input
                    type="file"
                    onChange={(event) =>  {setImageUpload(event.target.files[0])} }
                    className="form-control"
                  />
                </div>
                <button onClick={handlePhotoUpload}>
                  Upload
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
