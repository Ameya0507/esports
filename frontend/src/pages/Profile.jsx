import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : game === 'BGMI' ? <span className="badge badge-bgmi">{game}</span>
  : <span className="badge badge-neutral">{game}</span>;

const expBadge = exp => {
  const map = { Professional: 'badge-danger', 'Semi-Pro': 'badge-warning', Amateur: 'badge-info', Casual: 'badge-neutral' };
  return <span className={`badge ${map[exp] || 'badge-neutral'}`}>{exp}</span>;
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = id ? `/profiles/user/${id}` : '/profiles/me';
    api.get(endpoint)
      .then(r => setProfile(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Profile not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <div className="skeleton" style={{ width: 100, height: 100, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 28, width: '50%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 16, width: '35%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
              <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
            </div>
          </div>
        </div>
        <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
      </div>
    </div>
  );

  if (error && !id) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="empty-state">
          <span className="empty-state__icon">🎮</span>
          <p className="empty-state__title">No profile yet</p>
          <p className="empty-state__desc">Create your esports profile to start getting discovered by teams and organizations.</p>
          <button className="btn btn-primary" onClick={() => navigate('/edit-profile')}>
            Create profile
          </button>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="page-wrapper">
      <div className="container"><p className="text-muted">{error}</p></div>
    </div>
  );

  const isOwner = user?.id === profile.user._id;
  const tag = profile.user.gamerTag;
  const initials = tag?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className="page-wrapper">
      <div className="container animate-stagger" style={{ maxWidth: 800 }}>

        {/* ——— HERO HEADER ——— */}
        <div className="card" style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            <div className="avatar avatar--2xl avatar--brand">{initials}</div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {tag}
                  </h1>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>{profile.user.name}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                  {isOwner ? (
                    <button className="btn btn-secondary btn--sm" onClick={() => navigate('/edit-profile')}>
                      Edit profile
                    </button>
                  ) : (
                    <Link to={`/messages?userId=${profile.user._id}`} className="btn btn-primary btn--sm">
                      Message
                    </Link>
                  )}
                </div>
              </div>

              {/* Badges row */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                {gameBadge(profile.game)}
                {expBadge(profile.experience)}
                {profile.rank && <span className="badge badge-neutral">🏅 {profile.rank}</span>}
                {profile.region && <span className="badge badge-neutral">📍 {profile.region}</span>}
                {profile.availability && <span className="badge badge-success">🟢 {profile.availability}</span>}
              </div>

              {profile.about && (
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{profile.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* ——— DETAILS GRID ——— */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>

          {/* Roles */}
          <div className="card">
            <p className="section-label">Roles</p>
            {profile.roles?.length > 0 ? (
              <div className="role-grid">
                {profile.roles.map((r, i) => (
                  <span key={i} className="chip chip--active">{r}</span>
                ))}
              </div>
            ) : <p className="text-sm text-muted">No roles listed.</p>}
          </div>

          {/* Skills */}
          <div className="card">
            <p className="section-label">Skills</p>
            {profile.skills?.length > 0 ? (
              <div className="role-grid">
                {profile.skills.map((s, i) => (
                  <span key={i} className="chip">{s}</span>
                ))}
              </div>
            ) : <p className="text-sm text-muted">No skills listed.</p>}
          </div>
        </div>

        {/* Contact CTA for non-owners */}
        {!isOwner && (
          <div className="card" style={{ marginTop: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Interested in this player?</p>
              <p className="text-sm text-muted">Send a direct message to start a conversation.</p>
            </div>
            <Link to={`/messages?userId=${profile.user._id}`} className="btn btn-primary">
              Send message
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
