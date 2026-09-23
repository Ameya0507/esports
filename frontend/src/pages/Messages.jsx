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

  // No userId — empty state
  if (!userId) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="empty-state" style={{ paddingTop: 'var(--space-20)' }}>
          <span className="empty-state__icon">💬</span>
          <p className="empty-state__title">No conversation selected</p>
          <p className="empty-state__desc">
            Visit a player's profile and click "Message" to start a conversation.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--nav-h))',
      overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        minHeight: 60,
      }}>
        <div className="avatar avatar--md avatar--brand" style={{ flexShrink: 0 }}>
          {userId.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            Direct Message
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: i % 2 ? 'flex-start' : 'flex-end' }}>
                <div className="skeleton" style={{ height: 44, width: 140 + i * 30, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => {
            const isMine = msg.sender === user?.id;
            return (
              <div
                key={msg._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMine ? 'flex-end' : 'flex-start',
                  gap: 3,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 14,
                    lineHeight: 1.5,
                    background: isMine ? 'var(--brand)' : 'var(--bg-elevated)',
                    color: isMine ? 'white' : 'var(--text-primary)',
                    border: isMine ? 'none' : '1px solid var(--border-subtle)',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', padding: '0 4px' }}>
                  {fmt(msg.createdAt)}
                </span>
              </div>
            );
          })
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, opacity: 0.6 }}>
            <span style={{ fontSize: 32 }}>👋</span>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Say hi! No messages yet.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <form
          onSubmit={handleSend}
          style={{ display: 'flex', gap: 10, alignItems: 'center' }}
        >
          <input
            ref={inputRef}
            className="form-input"
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            style={{ flex: 1, height: 42 }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: 42, width: 42, padding: 0, flexShrink: 0 }}
            disabled={!newMessage.trim() || sending}
            title="Send"
          >
            {sending ? '…' : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </form>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5 }}>
          Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default Messages;
