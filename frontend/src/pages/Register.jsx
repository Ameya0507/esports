import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', gamerTag: '', email: '', password: '', primaryGame: 'Valorant', role: 'player',
  });
  const [submitting, setSubmitting] = useState(false);

  const { register, error, user, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home');
    setError(null);
  }, [user, navigate, setError]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await register(formData);
    if (ok) navigate('/home');
    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__mark">E</div>
          <span className="auth-logo__text">EsportsConnect</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create your profile</h1>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-6)' }}>
            Join thousands of competitive esports players
          </p>

          {error && (
            <div style={{
              background: 'var(--danger-muted)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 13,
              color: 'var(--danger)',
              marginBottom: 'var(--space-5)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label className="form-label">Gamer Tag</label>
                <input className="form-input" type="text" name="gamerTag" value={formData.gamerTag} onChange={handleChange} placeholder="ShadowGG#001" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} autoComplete="new-password" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Primary Game</label>
                <select className="form-select" name="primaryGame" value={formData.primaryGame} onChange={handleChange}>
                  <option value="Valorant">Valorant</option>
                  <option value="BGMI">BGMI</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">I am a…</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                  <option value="player">Player</option>
                  <option value="team_owner">Team Owner / Captain</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ height: 42, marginTop: 'var(--space-2)' }}
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
