import React from 'react';
import './App.css';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import UserList from './components/UserList';
import Chat from './components/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/signin" element={<SignIn />} />
      <Route path="/userlist" element={<UserList />} />
      <Route path="/chat/:recipientId" element={<Chat />} />
    </Routes>
  );
}

export default App;
