import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TeamProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get(`/teams/${id}`);
        setTeam(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Team not found');
      }
      setLoading(false);
    };
    fetchTeam();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '2rem 1.5rem' }}>Loading team...</div>;
  if (error) return <div className="container" style={{ padding: '2rem 1.5rem' }}>{error}</div>;

  const isOwner = user && user.id === team.owner._id;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ color: 'var(--color-accent-primary)' }}>{team.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
              {team.game} • {team.region} • {team.competitiveLevel}
            </p>
          </div>
          {isOwner && (
            <Link to={`/teams/${team._id}/edit`} className="btn btn-secondary">Manage Team</Link>
          )}
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>About</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>{team.about || 'No description provided.'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3>Current Roster</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
            {team.roster.map((member, idx) => (
              <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <Link to={`/profile/${member.player?._id}`} style={{ fontWeight: 'bold' }}>
                    {member.player?.gamerTag || 'Unknown Player'}
                  </Link>
                  {member.isCaptain && <span style={{ marginLeft: '0.5rem', color: 'gold', fontSize: '0.8rem' }}>★ Captain</span>}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{member.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Required Roles</h3>
          {team.requiredRoles && team.requiredRoles.length > 0 ? (
            <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
              {team.requiredRoles.map((req, idx) => (
                <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-danger)' }}>{req.role}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Priority: {req.priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>This team is full and not currently looking for players.</p>
          )}

          {isOwner && (
            <Link to={`/build-team?teamId=${team._id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Build My Team (Find Players)
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
