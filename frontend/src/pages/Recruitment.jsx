import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : <span className="badge badge-bgmi">{game}</span>;

const Recruitment = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState('');
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/recruitment')
      .then(r => setPosts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApply = async (postId, role) => {
    try {
      await api.post(`/recruitment/${postId}/apply`, {
        roleApplied: role,
        message: 'I am interested in joining your team!',
      });
      setAppliedIds(prev => new Set([...prev, `${postId}-${role}`]));
      showToast('Application sent successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply', 'danger');
    }
  };

  const filtered = gameFilter ? posts.filter(p => p.team?.game === gameFilter) : posts;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Recruitment Board</h1>
            <p className="page-header__sub">Browse open positions and apply to competitive teams</p>
          </div>
        </div>

        {/* Game filter */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {['', 'Valorant', 'BGMI'].map(g => (
            <button
              key={g}
              className={`btn btn--sm ${gameFilter === g ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setGameFilter(g)}
            >
              {g || 'All Games'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1,2,3].map(i => (
              <div key={i} className="recruit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="skeleton" style={{ height: 18, width: '40%' }} />
                  <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
                </div>
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '75%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filtered.map(post => (
              <div key={post._id} className="recruit-card">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 4 }}>
                      {post.title}
                    </h3>
                    <Link
                      to={`/teams/${post.team?._id}`}
                      style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}
                    >
                      🏆 {post.team?.name}
                    </Link>
                  </div>
                  {gameBadge(post.team?.game)}
                </div>

                {/* Description */}
                {post.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
                    {post.description}
                  </p>
                )}

                {/* Requirements */}
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <p className="section-label">Requirements</p>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                    {post.requirements?.minRank && (
                      <span className="badge badge-neutral">🏅 Min Rank: {post.requirements.minRank}</span>
                    )}
                    {post.requirements?.region && (
                      <span className="badge badge-neutral">📍 {post.requirements.region}</span>
                    )}
                    {post.requirements?.experience && (
                      <span className="badge badge-neutral">⭐ {post.requirements.experience}</span>
                    )}
                  </div>
                </div>

                {/* Roles */}
                <div>
                  <p className="section-label">Roles Needed</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                    {post.rolesNeeded?.map(role => {
                      const key = `${post._id}-${role}`;
                      const applied = appliedIds.has(key);
                      return (
                        <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)' }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{role}</span>
                          {user && (
                            <button
                              onClick={() => !applied && handleApply(post._id, role)}
                              className={`btn btn--sm ${applied ? 'btn-secondary' : 'btn-primary'}`}
                              style={{ height: 26, padding: '0 10px', fontSize: 12 }}
                              disabled={applied}
                            >
                              {applied ? '✓ Applied' : 'Apply'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">📋</span>
            <p className="empty-state__title">No open positions</p>
            <p className="empty-state__desc">
              {gameFilter ? `No ${gameFilter} recruitment posts yet.` : 'No recruitment posts yet. Check back later.'}
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast--${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
