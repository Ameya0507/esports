import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const VALORANT_ROLES = ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex', 'IGL'];
const BGMI_ROLES     = ['IGL', 'Assaulter', 'Support', 'Scout', 'Sniper', 'Entry Fragger', 'Flex'];

const gameBadge = game => game === 'Valorant'
  ? <span className="badge badge-valorant">{game}</span>
  : <span className="badge badge-bgmi">{game}</span>;

const PlayerCard = ({ player }) => {
  const tag = player.user?.gamerTag || '—';
  const initials = tag.slice(0, 2).toUpperCase();

  return (
    <Link to={`/profile/${player.user?._id}`} className="player-card" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div className="avatar avatar--lg avatar--brand">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2 }} className="truncate">
            {tag}
          </p>
          <p className="text-sm text-muted truncate">{player.user?.name}</p>
        </div>
        {gameBadge(player.game)}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {player.roles?.slice(0, 3).map(r => (
          <span key={r} className="chip" style={{ fontSize: 11 }}>{r}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-3)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)', marginBottom: 2 }}>Rank</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{player.rank || '—'}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)', marginBottom: 2 }}>Region</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{player.region || '—'}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)', marginBottom: 2 }}>Level</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{player.experience || '—'}</p>
        </div>
      </div>
    </Link>
  );
};

const PlayerSkeleton = () => (
  <div className="player-card">
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 20 }} />
      <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
    </div>
    <div style={{ display: 'flex', gap: 24 }}>
      <div className="skeleton" style={{ height: 32, width: 60 }} />
      <div className="skeleton" style={{ height: 32, width: 60 }} />
    </div>
  </div>
);

const PlayerSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    game:   searchParams.get('game')   || 'Valorant',
    role:   searchParams.get('role')   || '',
    rank:   searchParams.get('rank')   || '',
    region: searchParams.get('region') || '',
  });

  useEffect(() => {
    setLoading(true);
    let q = `?game=${filters.game}`;
    if (filters.role)   q += `&roles[in]=${filters.role}`;
    if (filters.rank)   q += `&rank[regex]=${filters.rank}&rank[options]=i`;
    if (filters.region) q += `&region[regex]=${filters.region}&region[options]=i`;

    api.get(`/profiles${q}`)
      .then(r => setPlayers(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, val) => {
    const next = { ...filters, [key]: val };
    if (key === 'game') next.role = '';
    setFilters(next);
  };

  const roles = filters.game === 'Valorant' ? VALORANT_ROLES : BGMI_ROLES;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Discover Players</h1>
            <p className="page-header__sub">Find competitive talent across Valorant and BGMI</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {/* Game toggle */}
          <div className="filter-bar__item" style={{ minWidth: 'auto' }}>
            <span className="filter-bar__label">Game</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Valorant', 'BGMI'].map(g => (
                <button
                  key={g}
                  onClick={() => setFilter('game', g)}
                  className={`btn btn--sm ${filters.game === g ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="filter-bar__item">
            <span className="filter-bar__label">Role</span>
            <select
              className="form-select"
              style={{ height: 34, fontSize: 13 }}
              value={filters.role}
              onChange={e => setFilter('role', e.target.value)}
            >
              <option value="">Any role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Rank */}
          <div className="filter-bar__item">
            <span className="filter-bar__label">Rank</span>
            <input
              className="form-input"
              style={{ height: 34, fontSize: 13 }}
              type="text"
              value={filters.rank}
              onChange={e => setFilter('rank', e.target.value)}
              placeholder="e.g. Immortal"
            />
          </div>

          {/* Region */}
          <div className="filter-bar__item">
            <span className="filter-bar__label">Region</span>
            <input
              className="form-input"
              style={{ height: 34, fontSize: 13 }}
              type="text"
              value={filters.region}
              onChange={e => setFilter('region', e.target.value)}
              placeholder="e.g. India"
            />
          </div>

          {(filters.role || filters.rank || filters.region) && (
            <button
              className="btn btn-ghost btn--sm"
              onClick={() => setFilters({ game: filters.game, role: '', rank: '', region: '' })}
              style={{ alignSelf: 'flex-end', marginBottom: 2 }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {[1,2,3,4,5,6].map(i => <PlayerSkeleton key={i} />)}
          </div>
        ) : players.length > 0 ? (
          <>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
              {players.length} player{players.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {players.map(p => <PlayerCard key={p._id} player={p} />)}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <p className="empty-state__title">No players found</p>
            <p className="empty-state__desc">Try adjusting your filters — no players matched your current search criteria.</p>
            <button className="btn btn-secondary" onClick={() => setFilters({ game: filters.game, role: '', rank: '', region: '' })}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;
