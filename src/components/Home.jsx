import React from 'react';
import Navbar from './navigation/Navbar';
import { Container, Row, Col } from 'react-bootstrap';

function Home() {
  return (
    <div className="Home">
      <Navbar />
      <div className="bg-primary py-5 text-white text-center" style={{marginTop: "5vh"}}>
        <Container>
          <h1 className="display-3 mb-4">Welcome to Chat App!</h1>
          <p className="lead">
            Chat App is a platform for seamless communication. Connect with friends, family, and colleagues instantly!
          </p>
        </Container>
      </div>
    </div>
  );
}

export default Home;
