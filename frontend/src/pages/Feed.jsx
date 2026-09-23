import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const QUICK_LINKS = [
  { to: '/players', label: 'Find Players', icon: '🔍' },
  { to: '/teams', label: 'Browse Teams', icon: '🏆' },
  { to: '/recruitment', label: 'Recruitment', icon: '📋' },
  { to: '/edit-profile', label: 'Edit Profile', icon: '✏️' },
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/posts')
      .then(r => setPosts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/posts', { content });
      setPosts(p => [res.data.data, ...p]);
      setContent('');
    } catch {
      // silent
    }
    setSubmitting(false);
  };

  const handleLike = async postId => {
    if (!user) return;
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(p => p.map(post => post._id === postId ? { ...post, likes: res.data.data } : post));
    } catch { /* silent */ }
  };

  const initials = name => name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '??';
  const timeAgo = dateStr => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-6)', alignItems: 'start' }}>

          {/* ——— MAIN FEED ——— */}
          <div>
            {/* Compose */}
            {user && (
              <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
                <form onSubmit={handlePost}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <div className="avatar avatar--md avatar--brand" style={{ flexShrink: 0 }}>
                      {initials(user.name || user.gamerTag || '')}
                    </div>
                    <textarea
                      className="form-textarea"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder="Share a clip, LFT post, or team update…"
                      rows={3}
                      style={{ flex: 1, resize: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                    <button
                      type="submit"
                      className="btn btn-primary btn--sm"
                      disabled={!content.trim() || submitting}
                    >
                      {submitting ? 'Posting…' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[1,2,3].map(i => (
                  <div key={i} className="card">
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}/>
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }}/>
                        <div className="skeleton" style={{ height: 11, width: '20%' }}/>
                      </div>
                    </div>
                    <div className="skeleton" style={{ height: 12, marginBottom: 8 }}/>
                    <div className="skeleton" style={{ height: 12, width: '80%' }}/>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {posts.map(post => {
                  const liked = post.likes?.some(l => l.user === user?.id);
                  return (
                    <div key={post._id} className="card">
                      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                        <Link to={`/profile/${post.author?._id}`} style={{ textDecoration: 'none' }}>
                          <div className="avatar avatar--md avatar--brand">
                            {initials(post.author?.gamerTag || '')}
                          </div>
                        </Link>
                        <div>
                          <Link
                            to={`/profile/${post.author?._id}`}
                            style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none' }}
                          >
                            {post.author?.gamerTag}
                          </Link>
                          <p className="text-xs text-tertiary" style={{ marginTop: 2, textTransform: 'none', letterSpacing: 0 }}>
                            {timeAgo(post.createdAt)}
                          </p>
                        </div>
                      </div>

                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: 'var(--space-4)' }}>
                        {post.content}
                      </p>

                      <div style={{ display: 'flex', gap: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-3)' }}>
                        <button
                          onClick={() => handleLike(post._id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: 13, fontWeight: 500,
                            color: liked ? 'var(--brand)' : 'var(--text-secondary)',
                            transition: 'color var(--t-fast)',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                          </svg>
                          {post.likes?.length || 0}
                        </button>
                        <span style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon">📭</span>
                <p className="empty-state__title">The feed is quiet</p>
                <p className="empty-state__desc">Be the first to post something — share a clip, an LFT update, or a team announcement.</p>
              </div>
            )}
          </div>

          {/* ——— SIDEBAR ——— */}
          <aside className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', position: 'sticky', top: 'calc(var(--nav-h) + var(--space-6))' }}>
            {/* Quick links */}
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Quick access</p>
              {QUICK_LINKS.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'all var(--t-fast)',
                    marginBottom: 2,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <span>{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Game focus */}
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <p className="section-label" style={{ marginBottom: 'var(--space-3)' }}>Browse by game</p>
              <Link
                to="/players?game=Valorant"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', textDecoration: 'none', marginBottom: 4, border: '1px solid rgba(255,70,85,0.2)', background: 'var(--valorant-muted)' }}
              >
                <span className="badge badge-valorant">Valorant</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Find players →</span>
              </Link>
              <Link
                to="/players?game=BGMI"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', textDecoration: 'none', border: '1px solid rgba(245,166,35,0.2)', background: 'var(--bgmi-muted)' }}
              >
                <span className="badge badge-bgmi">BGMI</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Find players →</span>
              </Link>
            </div>
          </aside>
        </div>

        {/* Mobile sidebar (shows below feed on mobile) */}
        <style>{`@media(max-width:768px){.feed-sidebar{display:none}}`}</style>
      </div>
    </div>
  );
};

export default Feed;
