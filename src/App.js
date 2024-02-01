import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import UserList from './components/UserList';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Post from './components/Post';

const PrivateRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/signin" element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path="/userlist" element={<UserList />} />
        <Route path="/chat/:recipientId" element={<Chat />} />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/post/:profileId/:photoId" element={<Post />} />
      </Route>
    </Routes>
  );
}

export default App;
