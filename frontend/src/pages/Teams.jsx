import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : <span className="badge badge-bgmi">{game}</span>;

const levelBadge = level => {
  const map = { Professional: 'badge-danger', 'Semi-Pro': 'badge-warning', Amateur: 'badge-info', Casual: 'badge-neutral', Competitive: 'badge-info' };
  return <span className={`badge ${map[level] || 'badge-neutral'}`}>{level}</span>;
};

const TeamSkeleton = () => (
  <div className="team-card">
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 15, width: '55%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 11, width: '35%' }} />
      </div>
    </div>
    <div className="skeleton" style={{ height: 40, marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 32, borderRadius: 8 }} />
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
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Teams</h1>
            <p className="page-header__sub">Browse competitive rosters looking for players</p>
          </div>
          <Link to="/create-team" className="btn btn-primary">
            Create team
          </Link>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {[1,2,3,4].map(i => <TeamSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map(team => (
              <div key={team._id} className="team-card">
                {/* Header */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div className="avatar avatar--md avatar--brand">
                    {team.name?.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2 }} className="truncate">
                      {team.name}
                    </p>
                    <p className="text-sm text-muted">{team.region}</p>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {gameBadge(team.game)}
                  {levelBadge(team.competitiveLevel)}
                  <span className="badge badge-neutral">👥 {team.roster?.length || 0} members</span>
                </div>

                {/* About */}
                {team.about && (
                  <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                    {team.about.length > 100 ? team.about.slice(0,100) + '…' : team.about}
                  </p>
                )}

                <Link
                  to={`/teams/${team._id}`}
                  className="btn btn-secondary btn-full"
                  style={{ textAlign: 'center' }}
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
