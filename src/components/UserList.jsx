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
                const user = data.docs.find(doc => doc.id === id);
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
        <div>
            <StackNavigator />
            <h1 style={{ textAlign: "center" }}> Hi, {userEmail}</h1>
            
            <div className="container mt-5">
                <div className="container mt-3" style={{display: 'flex', justifyContent: 'center', width: '20vw'}}>
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
                            <div key={user.id} className="card mb-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">{user.username}</h5>
                                    <p className="card-text">{user.email}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigation(`/chat/${id}/${user.id}`, { state: { receiverEmail: user.email, email: userEmail } })}
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

