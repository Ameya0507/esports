import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AVAILABLE_ROLES = {
  Valorant: ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex', 'IGL'],
  BGMI:     ['IGL', 'Assaulter', 'Support', 'Scout', 'Sniper', 'Entry Fragger', 'Flex'],
};
const AVAILABLE_SKILLS = {
  Valorant: ['Aim', 'Game Sense', 'Communication', 'Entry Fragging', 'Utility Usage', 'Clutching', 'IGL', 'Strategy', 'Map Knowledge'],
  BGMI:     ['Aim', 'Close-range Combat', 'Long-range Combat', 'IGL', 'Rotations', 'Communication', 'Clutching', 'Grenade Usage', 'Team Coordination'],
};

const SECTIONS = [
  { id: 'basics',       label: 'Basics' },
  { id: 'competitive',  label: 'Competitive' },
  { id: 'skills',       label: 'Skills' },
  { id: 'about',        label: 'About' },
];

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('basics');

  const [formData, setFormData] = useState({
    game: 'Valorant', roles: [], rank: '', region: '',
    experience: 'Casual', availability: 'Evenings / Weekends', skills: [], about: '',
  });

  useEffect(() => {
    api.get('/profiles/me')
      .then(r => {
        if (r.data.data) {
          const p = r.data.data;
          setFormData({
            game: p.game || 'Valorant', roles: p.roles || [], rank: p.rank || '',
            region: p.region || '', experience: p.experience || 'Casual',
            availability: p.availability || 'Evenings / Weekends', skills: p.skills || [], about: p.about || '',
          });
        }
      })
      .catch(err => { if (err.response?.status !== 404) setError('Failed to load profile'); })
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const toggleArr = (k, val) => set(k, formData[k].includes(val) ? formData[k].filter(x => x !== val) : [...formData[k], val]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/profiles', formData);
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate('/profile'); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving profile');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="skeleton" style={{ height: 44, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    </div>
  );

  const roles = AVAILABLE_ROLES[formData.game];
  const skills = AVAILABLE_SKILLS[formData.game];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Edit Profile</h1>
            <p className="page-header__sub">Your esports resume — make it count</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-muted)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 13, color: 'var(--danger)', marginBottom: 'var(--space-5)' }}>
            {error}
          </div>
        )}

        {/* Section Tabs */}
        <div className="tabs">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`tab${activeSection === s.id ? ' tab--active' : ''}`}
              onClick={() => setActiveSection(s.id)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ——— BASICS ——— */}
          {activeSection === 'basics' && (
            <div className="card">
              <div className="form-group">
                <label className="form-label">Primary Game</label>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {['Valorant', 'BGMI'].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`btn ${formData.game === g ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => { set('game', g); set('roles', []); set('skills', []); }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Rank</label>
                  <input className="form-input" type="text" value={formData.rank} onChange={e => set('rank', e.target.value)} placeholder="e.g. Immortal 2" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Region / Country</label>
                  <input className="form-input" type="text" value={formData.region} onChange={e => set('region', e.target.value)} placeholder="e.g. India" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select className="form-select" value={formData.experience} onChange={e => set('experience', e.target.value)}>
                    {['Casual', 'Amateur', 'Semi-Pro', 'Professional'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <input className="form-input" type="text" value={formData.availability} onChange={e => set('availability', e.target.value)} placeholder="e.g. Evenings / Weekends" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveSection('competitive')}>
                  Next: Competitive →
                </button>
              </div>
            </div>
          )}

          {/* ——— COMPETITIVE ——— */}
          {activeSection === 'competitive' && (
            <div className="card">
              <div className="form-group">
                <label className="form-label">
                  Roles <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>— select all that apply</span>
                </label>
                <div className="role-grid" style={{ marginTop: 'var(--space-2)' }}>
                  {roles.map(r => (
                    <button
                      type="button"
                      key={r}
                      className={`chip${formData.roles.includes(r) ? ' chip--active' : ''}`}
                      onClick={() => toggleArr('roles', r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setActiveSection('basics')}>← Back</button>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveSection('skills')}>Next: Skills →</button>
              </div>
            </div>
          )}

          {/* ——— SKILLS ——— */}
          {activeSection === 'skills' && (
            <div className="card">
              <div className="form-group">
                <label className="form-label">
                  Skills <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>— select what you're great at</span>
                </label>
                <div className="role-grid" style={{ marginTop: 'var(--space-2)' }}>
                  {skills.map(s => (
                    <button
                      type="button"
                      key={s}
                      className={`chip${formData.skills.includes(s) ? ' chip--active' : ''}`}
                      onClick={() => toggleArr('skills', s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setActiveSection('competitive')}>← Back</button>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveSection('about')}>Next: About →</button>
              </div>
            </div>
          )}

          {/* ——— ABOUT ——— */}
          {activeSection === 'about' && (
            <div className="card">
              <div className="form-group">
                <label className="form-label">About Me</label>
                <textarea
                  className="form-textarea"
                  value={formData.about}
                  onChange={e => set('about', e.target.value)}
                  rows={5}
                  placeholder="Tell teams about your competitive background, goals, and what kind of team you're looking for…"
                  style={{ minHeight: 140 }}
                />
                <span className="form-hint">{formData.about.length} characters</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setActiveSection('skills')}>← Back</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || saved}
                >
                  {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
