import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams');
        setTeams(res.data.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
      setLoading(false);
    };
    fetchTeams();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Teams</h1>
        <Link to="/create-team" className="btn btn-primary">Create Team</Link>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {teams.length > 0 ? teams.map(team => (
            <div key={team._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--color-accent-primary)' }}>{team.name}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{team.game} • {team.region}</p>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.1rem 0.5rem', backgroundColor: 'var(--color-bg-hover)', borderRadius: '4px' }}>
                  {team.competitiveLevel}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{team.about ? (team.about.substring(0, 100) + '...') : 'No description'}</p>
              
              <Link to={`/teams/${team._id}`} className="btn btn-secondary" style={{ textAlign: 'center' }}>
                View Team
              </Link>
            </div>
          )) : (
            <p>No teams found. Be the first to create one!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;
