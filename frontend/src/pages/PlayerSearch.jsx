import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    game: 'Valorant',
    role: '',
    rank: '',
    region: ''
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        // Build query string
        let queryStr = `?game=${filters.game}`;
        if (filters.role) queryStr += `&roles[in]=${filters.role}`;
        if (filters.rank) queryStr += `&rank[regex]=${filters.rank}&rank[options]=i`;
        if (filters.region) queryStr += `&region[regex]=${filters.region}&region[options]=i`;
        
        const res = await api.get(`/profiles${queryStr}`);
        setPlayers(res.data.data);
      } catch (err) {
        console.error('Error fetching players:', err);
      }
      setLoading(false);
    };
    
    fetchPlayers();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Discover Players</h1>
      
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Game</label>
            <select name="game" value={filters.game} onChange={handleChange}>
              <option value="Valorant">Valorant</option>
              <option value="BGMI">BGMI</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Role</label>
            <select name="role" value={filters.role} onChange={handleChange}>
              <option value="">Any Role</option>
              {filters.game === 'Valorant' 
                ? ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex', 'IGL'].map(r => <option key={r} value={r}>{r}</option>)
                : ['IGL', 'Assaulter', 'Support', 'Scout', 'Sniper', 'Entry Fragger', 'Flex'].map(r => <option key={r} value={r}>{r}</option>)
              }
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Rank (Search)</label>
            <input type="text" name="rank" value={filters.rank} onChange={handleChange} placeholder="e.g. Immortal" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Region</label>
            <input type="text" name="region" value={filters.region} onChange={handleChange} placeholder="e.g. India" />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading players...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {players.length > 0 ? players.map(player => (
            <div key={player._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'var(--color-accent-secondary)' }}>{player.user?.gamerTag}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{player.user?.name}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', padding: '0.1rem 0.5rem', backgroundColor: 'var(--color-bg-hover)', borderRadius: '4px' }}>{player.rank}</span>
                  <span style={{ fontSize: '0.85rem', padding: '0.1rem 0.5rem', backgroundColor: 'var(--color-bg-hover)', borderRadius: '4px' }}>{player.region}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>ROLES</strong>
                  <p style={{ fontSize: '0.9rem' }}>{player.roles.join(', ')}</p>
                </div>
              </div>
              <Link to={`/profile/${player.user?._id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                View Profile
              </Link>
            </div>
          )) : (
            <p>No players found matching your filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
