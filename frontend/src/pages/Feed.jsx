import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await api.post('/posts', { content });
      setPosts([res.data.data, ...posts]);
      setContent('');
    } catch (err) {
      alert('Error creating post');
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const res = await api.put(`/posts/${postId}/like`);
      // Update the specific post's likes locally
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return { ...post, likes: res.data.data };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Esports Feed</h1>

      {user && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handlePost}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update, clip, or look for a team..."
              rows="3"
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={!content.trim()}>
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading feed...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.length > 0 ? posts.map(post => (
            <div key={post._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link to={`/profile/${post.author?._id}`} style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                  {post.author?.gamerTag}
                </Link>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
              
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <button 
                  onClick={() => handleLike(post._id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: (post.likes && user && post.likes.some(l => l.user === user.id)) ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={(post.likes && user && post.likes.some(l => l.user === user.id)) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  {post.likes ? post.likes.length : 0} Likes
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {post.comments ? post.comments.length : 0} Comments
                </button>
              </div>
            </div>
          )) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No posts yet. Be the first to share an update!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
