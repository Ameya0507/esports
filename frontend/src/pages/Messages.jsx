import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId'); // The ID of the person we are messaging
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
      setLoading(false);
    };

    fetchMessages();
    
    // Polling for MVP (In real app use Socket.io)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const res = await api.post('/messages', {
        receiverId: userId,
        content: newMessage
      });
      setMessages([...messages, res.data.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!userId) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div className="card">
          <h2>Messages</h2>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Select a player from their profile to start messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1rem' }}>Conversation</h2>
      
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div 
                key={msg._id} 
                style={{ 
                  alignSelf: msg.sender === user?.id ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === user?.id ? 'var(--color-accent-primary)' : 'var(--color-bg-hover)',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  borderBottomRightRadius: msg.sender === user?.id ? '0' : '1rem',
                  borderBottomLeftRadius: msg.sender === user?.id ? '1rem' : '0',
                  maxWidth: '70%'
                }}
              >
                <p>{msg.content}</p>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.5rem', display: 'block', textAlign: 'right' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '2rem' }}>No messages yet. Say hi!</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type a message..." 
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
