import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : <span className="badge badge-bgmi">{game}</span>;

const TeamProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('roster');

  useEffect(() => {
    api.get(`/teams/${id}`)
      .then(r => setTeam(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Team not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="skeleton" style={{ height: 160, borderRadius: 12, marginBottom: 20 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    </div>
  );

  if (error) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state">
          <span className="empty-state__icon">❌</span>
          <p className="empty-state__title">Team not found</p>
          <button className="btn btn-secondary" onClick={() => navigate('/teams')}>Back to teams</button>
        </div>
      </div>
    </div>
  );

  const isOwner = user?.id === team.owner?._id;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>

        {/* ——— TEAM HEADER ——— */}
        <div className="card" style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="avatar avatar--xl avatar--brand">
              {team.name?.slice(0,2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {team.name}
                </h1>
                {isOwner && (
                  <Link to={`/build-team?teamId=${team._id}`} className="btn btn-primary btn--sm">
                    Build roster
                  </Link>
                )}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                {gameBadge(team.game)}
                <span className="badge badge-neutral">{team.competitiveLevel}</span>
                <span className="badge badge-neutral">📍 {team.region}</span>
                <span className={`badge ${team.requiredRoles?.length > 0 ? 'badge-success' : 'badge-neutral'}`}>
                  {team.requiredRoles?.length > 0 ? '🔓 Recruiting' : '🔒 Full Roster'}
                </span>
              </div>

              {team.about && (
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{team.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* ——— TABS ——— */}
        <div className="tabs">
          {['roster', 'openings'].map(t => (
            <button
              key={t}
              className={`tab${activeTab === t ? ' tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'roster' ? `Roster (${team.roster?.length || 0})` : `Open Roles (${team.requiredRoles?.length || 0})`}
            </button>
          ))}
        </div>

        {activeTab === 'roster' && (
          <div className="card">
            {team.roster?.length > 0 ? team.roster.map((member, idx) => (
              <div key={idx} className="info-row" style={{ gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div className="avatar avatar--sm avatar--brand">
                    {member.player?.gamerTag?.slice(0,2).toUpperCase() || '??'}
                  </div>
                  <div>
                    <Link
                      to={`/profile/${member.player?._id}`}
                      style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                    >
                      {member.player?.gamerTag || 'Unknown'}
                    </Link>
                    {member.isCaptain && (
                      <span className="badge badge-warning" style={{ marginLeft: 'var(--space-2)', fontSize: 10 }}>Captain</span>
                    )}
                  </div>
                </div>
                <span className="chip" style={{ fontSize: 12 }}>{member.role}</span>
              </div>
            )) : (
              <p className="text-sm text-muted" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                No roster members yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'openings' && (
          <div className="card">
            {team.requiredRoles?.length > 0 ? (
              <>
                <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-5)' }}>
                  This team is actively looking for players to fill these roles.
                </p>
                {team.requiredRoles.map((req, idx) => (
                  <div key={idx} className="info-row">
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{req.role}</span>
                    <span className={`badge ${req.priority === 'High' ? 'badge-danger' : req.priority === 'Medium' ? 'badge-warning' : 'badge-neutral'}`}>
                      {req.priority} Priority
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 'var(--space-5)' }}>
                  <Link to="/recruitment" className="btn btn-secondary btn--sm">
                    See recruitment board →
                  </Link>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-10) var(--space-6)' }}>
                <span className="empty-state__icon">✅</span>
                <p className="empty-state__title">Roster is full</p>
                <p className="empty-state__desc">This team is not currently recruiting players.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamProfile;
