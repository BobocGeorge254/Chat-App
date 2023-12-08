import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Button from 'react-bootstrap/Button';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const receiverEmail = location.state?.receiverEmail;
  const userEmail = location.state?.email;

  const messageCollection = collection(db, 'messages');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const combinedQuery = query(
          messageCollection,
          orderBy('timestamp') // Sort messages by timestamp
        );

        const querySnapshot = await getDocs(combinedQuery);
        const allMessages = querySnapshot.docs.map(doc => doc.data());

        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [messageCollection]);

  const sendMessage = async e => {
    e.preventDefault();
    if (message.trim() !== '') {
      try {
        await addDoc(messageCollection, {
          sender: userEmail,
          receiver: receiverEmail,
          content: message,
          timestamp: new Date().toISOString(),
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Chat with {receiverEmail}</h1>
      <div style={{ height: '70vh', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === userEmail ? 'right' : 'left' }}>
            <p
              style={{
                display: 'inline-block',
                padding: '5px 10px',
                borderRadius: '10px',
                backgroundColor: msg.sender === userEmail ? '#DCF8C6' : '#ACDFFB',
                margin: '5px 0',
                maxWidth: '40vw', // Limit width to 50% of viewport width
                wordWrap: 'break-word',
                textAlign: 'left'
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{display: 'flex', justifyContent: "center"}}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ marginTop: '10px', width: '80%', padding: '5px' }}
        />
        <Button variant="primary" type='submit' style={{marginTop: '10px'}}>Send</Button>{' '}
      </form>
    </div>
  );
};

export default Chat;
