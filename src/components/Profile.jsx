import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import StackNavigator from './navigation/StackNavigator';

const Profile = () => {
 
  const [profilePicture, setProfilePicture] = useState(''); // Store image URL or file object
  const [description, setDescription] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  // Function to handle profile picture upload
  const handleProfilePictureUpload = event => {
   
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = event => {
    const files = Array.from(event.target.files);
    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then(images => {
        setUploadedPhotos([...uploadedPhotos, ...images]);
      })
      .catch(error => {
        console.error('Error uploading photos:', error);
      });
  };

  // Function to handle form submission for description update
  const handleDescriptionSubmit = event => {
    event.preventDefault();
    console.log('Updated description:', description);
  };

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

          {/* Grid layout for photos */}
          <Col md={8}>
            <Row>
              {uploadedPhotos.length === 0 ? (
                <Col className="text-center">No posts yet</Col>
              ) : (
                uploadedPhotos.map((photo, index) => (
                  <Col key={index} sm={4} className="mb-3">
                    <img src={photo} alt={`Uploaded Photo ${index + 1}`} className="img-fluid"
                    style={{ width: '20vw', height: '30vh' }} />
                  </Col>
                ))
              )}
              <Col sm={4} className="mb-3">
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="form-control"
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
