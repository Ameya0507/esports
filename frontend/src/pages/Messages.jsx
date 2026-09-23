import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useContext(AuthContext);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetch = () => api.get(`/messages/${userId}`)
      .then(r => setMessages(r.data.data))
      .catch(console.error);

    fetch().finally(() => setLoading(false));
    const interval = setInterval(fetch, 4000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;
    setSending(true);
    try {
      const res = await api.post('/messages', { receiverId: userId, content: newMessage });
      setMessages(m => [...m, res.data.data]);
      setNewMessage('');
      inputRef.current?.focus();
    } catch { /* silent */ }
    setSending(false);
  };

  const fmt = d => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!userId) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="empty-state" style={{ paddingTop: 'var(--space-20)' }}>
          <span className="empty-state__icon">💬</span>
          <p className="empty-state__title">No conversation selected</p>
          <p className="empty-state__desc">
            Visit a player's profile and click "Message" to start a conversation. All your messages will appear here.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - var(--nav-h))', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: 'var(--space-4) var(--space-6)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        flexShrink: 0,
      }}>
        <div className="avatar avatar--md avatar--brand">
          {userId.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Direct Message</p>
          <p className="text-xs text-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>
            {messages.length} messages
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', background: 'var(--bg-base)' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignSelf: i % 2 ? 'flex-start' : 'flex-end' }}>
                {i % 2 === 1 && <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />}
                <div className="skeleton" style={{ height: 44, width: 180 + i * 40, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => {
            const isMine = msg.sender === user?.id;
            return (
              <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                <div className={`msg-bubble ${isMine ? 'msg-bubble--self' : 'msg-bubble--other'}`}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, paddingX: 4 }}>
                  {fmt(msg.createdAt)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ padding: 'var(--space-12) 0' }}>
            <span className="empty-state__icon">👋</span>
            <p className="empty-state__title">Start the conversation</p>
            <p className="empty-state__desc">Say hi! No messages yet.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: 'var(--space-4) var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <input
            ref={inputRef}
            className="form-input"
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            style={{ flex: 1, height: 42 }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: 42, padding: '0 var(--space-5)', flexShrink: 0 }}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? '…' : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-muted" style={{ marginTop: 6, textTransform: 'none', letterSpacing: 0 }}>
          Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default Messages;
