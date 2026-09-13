import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Recruitment = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const res = await api.get('/recruitment');
        setPosts(res.data.data);
      } catch (err) {
        console.error('Error fetching recruitment posts:', err);
      }
      setLoading(false);
    };
    fetchRecruitments();
  }, []);

  const handleApply = async (postId, role) => {
    try {
      await api.post(`/recruitment/${postId}/apply`, {
        roleApplied: role,
        message: 'I am interested in joining your team!'
      });
      alert('Application sent successfully!');
      // In a real app, update state to show "Applied" instead of an alert
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying to team');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Recruitment Board</h1>
        {/* Teams could have a button here to create a new recruitment post */}
      </div>

      {loading ? (
        <p>Loading open positions...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.length > 0 ? posts.map(post => (
            <div key={post._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'var(--color-accent-primary)', marginBottom: '0.5rem' }}>{post.title}</h3>
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', height: 'fit-content' }}>
                  {post.team?.game}
                </span>
              </div>
              
              <Link to={`/teams/${post.team?._id}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'underline', marginBottom: '1rem', display: 'inline-block' }}>
                {post.team?.name}
              </Link>
              
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{post.description}</p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>REQUIREMENTS</strong>
                <ul style={{ listStyle: 'inside', fontSize: '0.9rem' }}>
                  <li>Min Rank: {post.requirements?.minRank || 'Any'}</li>
                  <li>Region: {post.requirements?.region || 'Any'}</li>
                  <li>Experience: {post.requirements?.experience || 'Any'}</li>
                </ul>
              </div>

              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>ROLES NEEDED</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {post.rolesNeeded.map(role => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-bg-hover)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                      <span>{role}</span>
                      {user && (
                        <button 
                          onClick={() => handleApply(post._id, role)}
                          className="btn btn-primary" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No open recruitment posts found right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recruitment;
