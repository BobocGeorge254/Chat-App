import React, { useState, useEffect }  from 'react';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Navbar from './navigation/Navbar';
import UserList from './UserList';


function Home() {
  
    return (
      
      <div className="Home">    
        <Navbar />
        <h1> Welcome! </h1>
      </div>
    );
}
  

export default Home;
