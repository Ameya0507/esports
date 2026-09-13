import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gamerTag: '',
    email: '',
    password: '',
    role: 'player'
  });

  const { register, error, user, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
    setError(null);
  }, [user, navigate, setError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 className="auth-title">Join EsportsConnect</h2>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gamerTag">Gamer Tag</label>
            <input
              type="text"
              id="gamerTag"
              name="gamerTag"
              value={formData.gamerTag}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">I am a...</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="player">Player</option>
              <option value="team_owner">Team Owner / Captain</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
