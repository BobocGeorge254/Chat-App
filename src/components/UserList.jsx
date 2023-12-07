import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email ;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, 'users');
                const data = await getDocs(userCollection);
                const userList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setUsers(userList);
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
        <div>
            <h1 style={{ textAlign: "center" }}>{userEmail}</h1>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {/* ... (input and filtering code remains unchanged) */}
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="card mb-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">{user.username}</h5>
                                    <p className="card-text">{user.email}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigation(`/chat/${user.id}`)}
                                    >
                                        Chat
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

