import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    game: 'Valorant',
    roles: [],
    rank: '',
    region: '',
    experience: 'Casual',
    availability: 'Evenings / Weekends',
    skills: [],
    about: '',
  });

  const availableRoles = {
    Valorant: ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex', 'IGL'],
    BGMI: ['IGL', 'Assaulter', 'Support', 'Scout', 'Sniper', 'Entry Fragger', 'Flex']
  };

  const availableSkills = {
    Valorant: ['Aim', 'Game Sense', 'Communication', 'Entry Fragging', 'Utility Usage', 'Clutching', 'IGL', 'Strategy', 'Map Knowledge'],
    BGMI: ['Aim', 'Close-range Combat', 'Long-range Combat', 'IGL', 'Rotations', 'Communication', 'Clutching', 'Grenade Usage', 'Team Coordination']
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me');
        if (res.data.data) {
          const p = res.data.data;
          setFormData({
            game: p.game || 'Valorant',
            roles: p.roles || [],
            rank: p.rank || '',
            region: p.region || '',
            experience: p.experience || 'Casual',
            availability: p.availability || 'Evenings / Weekends',
            skills: p.skills || [],
            about: p.about || '',
          });
        }
      } catch (err) {
        // It's okay if profile doesn't exist yet (404)
        if (err.response?.status !== 404) {
          setError('Failed to load profile');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role) => {
    const updatedRoles = formData.roles.includes(role)
      ? formData.roles.filter(r => r !== role)
      : [...formData.roles, role];
    setFormData({ ...formData, roles: updatedRoles });
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profiles', formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving profile');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '2rem' }}>Edit Your Profile</h2>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Primary Game</label>
            <select name="game" value={formData.game} onChange={(e) => {
              handleChange(e);
              setFormData(prev => ({ ...prev, roles: [], skills: [] })); // Reset on game change
            }}>
              <option value="Valorant">Valorant</option>
              <option value="BGMI">BGMI</option>
            </select>
          </div>

          <div className="form-group">
            <label>Roles (Select multiple)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableRoles[formData.game].map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => handleRoleToggle(role)}
                  className={`btn ${formData.roles.includes(role) ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Rank</label>
              <input type="text" name="rank" value={formData.rank} onChange={handleChange} placeholder="e.g. Immortal 2" required />
            </div>
            <div className="form-group">
              <label>Region / Country</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="e.g. India" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experience" value={formData.experience} onChange={handleChange}>
                <option value="Casual">Casual</option>
                <option value="Amateur">Amateur</option>
                <option value="Semi-Pro">Semi-Pro</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            <div className="form-group">
              <label>Availability</label>
              <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g. Evenings / Weekends" />
            </div>
          </div>

          <div className="form-group">
            <label>Skills (Select multiple)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSkills[formData.game].map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '4px',
                    border: `1px solid ${formData.skills.includes(skill) ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                    backgroundColor: formData.skills.includes(skill) ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: formData.skills.includes(skill) ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>About Me</label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows="4" placeholder="Tell teams about yourself..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
