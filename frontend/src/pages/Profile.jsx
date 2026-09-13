import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = id ? `/profiles/user/${id}` : '/profiles/me';
        const res = await api.get(endpoint);
        setProfile(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading profile...</div>;

  if (error && !id) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2>You haven't set up your profile yet.</h2>
        <button className="btn btn-primary" onClick={() => navigate('/edit-profile')} style={{ marginTop: '1rem' }}>
          Create Profile
        </button>
      </div>
    );
  }

  if (error) return <div className="container" style={{ paddingTop: '2rem' }}>{error}</div>;

  const isOwner = user && user.id === profile.user._id;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {profile.user.gamerTag}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>{profile.user.name}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: 'var(--color-bg-hover)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--color-accent-secondary)' }}>
                {profile.game}
              </span>
              <span style={{ backgroundColor: 'var(--color-bg-hover)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                {profile.rank}
              </span>
              <span style={{ backgroundColor: 'var(--color-bg-hover)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                {profile.region}
              </span>
            </div>
          </div>
          {isOwner && (
            <button className="btn btn-secondary" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3>About</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>{profile.about || 'No description provided.'}</p>
            
            <h3 style={{ marginTop: '1.5rem' }}>Details</h3>
            <ul style={{ listStyle: 'none', color: 'var(--color-text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Experience:</strong> {profile.experience}</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Availability:</strong> {profile.availability}</li>
            </ul>
          </div>
          
          <div>
            <h3>Roles</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {profile.roles.map((role, idx) => (
                <span key={idx} style={{ border: '1px solid var(--color-border)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                  {role}
                </span>
              ))}
            </div>

            <h3>Skills</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profile.skills.length > 0 ? profile.skills.map((skill, idx) => (
                <span key={idx} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                  {skill}
                </span>
              )) : <span style={{ color: 'var(--color-text-secondary)' }}>No specific skills listed.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
