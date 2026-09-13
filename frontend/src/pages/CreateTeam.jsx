import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    game: 'Valorant',
    region: '',
    competitiveLevel: 'Amateur',
    about: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/teams', formData);
      navigate(`/teams/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating team');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '2rem' }}>Create a New Team</h2>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Team Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Game</label>
            <select name="game" value={formData.game} onChange={handleChange}>
              <option value="Valorant">Valorant</option>
              <option value="BGMI">BGMI</option>
            </select>
          </div>

          <div className="form-group">
            <label>Region</label>
            <input type="text" name="region" value={formData.region} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Competitive Level</label>
            <select name="competitiveLevel" value={formData.competitiveLevel} onChange={handleChange}>
              <option value="Casual">Casual</option>
              <option value="Amateur">Amateur</option>
              <option value="Semi-Pro">Semi-Pro</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label>About Team</label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows="4" placeholder="Describe your team's goals..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Team</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
