import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : <span className="badge badge-bgmi">{game}</span>;

const levelColor = level => {
  const map = { Professional: 'badge-danger', 'Semi-Pro': 'badge-warning', Competitive: 'badge-info', Amateur: 'badge-info', Casual: 'badge-neutral' };
  return map[level] || 'badge-neutral';
};

const TeamSkeleton = () => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 11, width: '35%' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 20 }} />
      <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 20 }} />
    </div>
    <div className="skeleton" style={{ height: 36, width: '50%', marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 36, borderRadius: 8 }} />
  </div>
);

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState('');

  useEffect(() => {
    api.get('/teams')
      .then(r => setTeams(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = gameFilter ? teams.filter(t => t.game === gameFilter) : teams;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Teams</h1>
            <p className="page-header__sub">Browse competitive rosters looking for players</p>
          </div>
          <Link to="/create-team" className="btn btn-primary">
            + Create team
          </Link>
        </div>

        {/* Game filter */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          {['', 'Valorant', 'BGMI'].map(g => (
            <button
              key={g}
              className={`btn btn--sm ${gameFilter === g ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setGameFilter(g)}
            >
              {g || 'All Games'}
            </button>
          ))}
          {!loading && (
            <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
              {filtered.length} team{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {[1,2,3,4].map(i => <TeamSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map(team => (
              <div
                key={team._id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Team identity */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div className="avatar avatar--md avatar--brand">
                    {team.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {team.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📍 {team.region}</p>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {gameBadge(team.game)}
                  <span className={`badge ${levelColor(team.competitiveLevel)}`}>{team.competitiveLevel}</span>
                  <span className="badge badge-neutral">👥 {team.roster?.length || 0}</span>
                </div>

                {/* About */}
                {team.about && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                    {team.about.length > 90 ? team.about.slice(0, 90) + '…' : team.about}
                  </p>
                )}

                {/* CTA */}
                <Link
                  to={`/teams/${team._id}`}
                  className="btn btn-secondary btn-full"
                  style={{ textAlign: 'center', marginTop: 'auto' }}
                >
                  View team →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🏆</span>
            <p className="empty-state__title">No teams found</p>
            <p className="empty-state__desc">
              {gameFilter ? `No ${gameFilter} teams yet.` : 'No teams yet.'} Be the first to create one!
            </p>
            <Link to="/create-team" className="btn btn-primary">Create team</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
