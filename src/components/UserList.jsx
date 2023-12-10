

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import StackNavigator from './navigation/StackNavigator';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigation = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = params.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, 'users');
                const data = await getDocs(userCollection);
                const userList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setUsers(userList);
                console.log("Id-ul este", id);
                const user = data.docs.find((doc) => doc.id === id);
                if (user) {
                    setUserEmail(user.data().email);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) => {
        const username = user.username ? user.username.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const searchTermLower = searchTerm.toLowerCase();
        return username.includes(searchTermLower) || email.includes(searchTermLower);
    });

   return (
    <div style = {{backgroundColor: '#fafafa'}}>
        <StackNavigator />
        <h1 style={{ textAlign: "center", fontFamily: 'Arial, sans-serif' }}> Hi, {userEmail}</h1>

        <div className="container mt-5">
            <div className="container mt-3" style={{ display: 'flex', justifyContent: 'center', width: '20vw' }}>
                <input
                    type="text"
                    placeholder="Search by username or email"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        padding: '8px',
                        margin: '10px 0',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="card mb-3" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px', border: '1px solid #eee', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={user.profilePicture} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '12px', display: 'flex', justifyContent: 'center' }} />
                            <div>
                                <h5 className="card-title" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>{user.username}</h5>
                                <p className="card-text" style={{ color: '#888', fontFamily: 'Arial, sans-serif' }}>{user.email}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigation(`/chat/${id}/${user.id}`, { state: { receiverEmail: user.email, email: userEmail } })}
                                    style={{ backgroundColor: '#3897f0', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px', marginRight: '8px' }}
                                >
                                    Chat
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigation(`/profile/${user.id}`, { state: { receiverEmail: user.email, email: userEmail } })}
                                    style={{ backgroundColor: '#3897f0', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px' }}
                                >
                                    Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

};

export default UserList;



