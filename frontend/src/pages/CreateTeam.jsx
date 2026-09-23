import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', game: 'Valorant', region: '', competitiveLevel: 'Amateur', about: '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.post('/teams', formData);
      navigate(`/teams/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating team');
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Create a Team</h1>
            <p className="page-header__sub">Set up your competitive roster</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-muted)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 13, color: 'var(--danger)', marginBottom: 'var(--space-5)' }}>
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input className="form-input" type="text" value={formData.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Team Phantom" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Game</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {['Valorant', 'BGMI'].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`btn btn--sm ${formData.game === g ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => set('game', g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Region / Country</label>
                <input className="form-input" type="text" value={formData.region} onChange={e => set('region', e.target.value)} placeholder="e.g. India" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Competitive Level</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {['Casual', 'Amateur', 'Semi-Pro', 'Professional'].map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`chip${formData.competitiveLevel === l ? ' chip--active' : ''}`}
                    onClick={() => set('competitiveLevel', l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">About Your Team</label>
              <textarea
                className="form-textarea"
                value={formData.about}
                onChange={e => set('about', e.target.value)}
                rows={4}
                placeholder="Describe your team's goals, playstyle, and what you're looking for in teammates…"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ height: 44 }} disabled={saving}>
              {saving ? 'Creating team…' : 'Create team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
