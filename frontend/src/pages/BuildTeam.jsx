import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const BuildTeam = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  
  const [team, setTeam] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [missingRoles, setMissingRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchingData = async () => {
      if (!teamId) {
        setError("Please provide a teamId in the URL.");
        setLoading(false);
        return;
      }
      
      try {
        // Fetch team details
        const teamRes = await api.get(`/teams/${teamId}`);
        setTeam(teamRes.data.data);

        // Fetch recommendations
        const matchRes = await api.get(`/matching/teams/${teamId}/recommendations`);
        setRecommendations(matchRes.data.data || []);
        setMissingRoles(matchRes.data.missingRoles || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching matching data');
      }
      setLoading(false);
    };
    
    fetchMatchingData();
  }, [teamId]);

  if (loading) return <div className="container" style={{ padding: '2rem 1.5rem' }}>Analyzing team composition...</div>;
  if (error) return <div className="container" style={{ padding: '2rem 1.5rem', color: 'var(--color-danger)' }}>{error}</div>;

  const rosterRoles = team.roster.map(r => r.role);
  const teamSize = team.roster.length;
  const maxTeamSize = team.game === 'Valorant' ? 5 : 4; // BGMI usually 4
  const balanceScore = Math.round((teamSize / maxTeamSize) * 100);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Build My Team</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Finding the missing pieces for {team.name}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: balanceScore > 80 ? 'var(--color-success)' : 'var(--color-accent-primary)' }}>
            {balanceScore}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Team Balance</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>YOUR TEAM</h3>
        <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
          {team.roster.map((member, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-success)' }}>🟢</span>
              <strong style={{ minWidth: '100px' }}>{member.role}</strong>
              <span style={{ color: 'var(--color-text-secondary)' }}>— {member.player?.gamerTag}</span>
            </li>
          ))}
          {missingRoles.map((role, idx) => (
            <li key={`missing-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-danger)' }}>🔴</span>
              <strong style={{ minWidth: '100px' }}>{role}</strong>
              <span style={{ color: 'var(--color-text-secondary)' }}>— Missing</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Smart Recommendations</h2>
      
      {recommendations.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {recommendations.map(rec => (
            <div key={rec.profile._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: 'var(--color-accent-primary)' }}>{rec.profile.user?.gamerTag}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{rec.bestRoleMatch} • {rec.profile.rank} • {rec.profile.region}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: rec.totalScore > 80 ? 'var(--color-success)' : 'var(--color-accent-secondary)' }}>
                    {rec.totalScore}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Match</div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Role Match</span>
                    <span>{rec.scoreBreakdown.role}/30</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(rec.scoreBreakdown.role/30)*100}%`, backgroundColor: 'var(--color-accent-secondary)', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Rank Match</span>
                    <span>{rec.scoreBreakdown.rank}/20</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(rec.scoreBreakdown.rank/20)*100}%`, backgroundColor: 'var(--color-accent-secondary)', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Playstyle</span>
                    <span>{rec.scoreBreakdown.playstyle}/15</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(rec.scoreBreakdown.playstyle/15)*100}%`, backgroundColor: 'var(--color-accent-secondary)', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Availability</span>
                    <span>{rec.scoreBreakdown.availability}/15</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(rec.scoreBreakdown.availability/15)*100}%`, backgroundColor: 'var(--color-accent-secondary)', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Link to={`/profile/${rec.profile.user?._id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                  View Profile
                </Link>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  Send Invitation
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No candidates found matching your missing roles. Try adjusting your team requirements.</p>
      )}
    </div>
  );
};

export default BuildTeam;
