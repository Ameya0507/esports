import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gamerTag: '',
    email: '',
    password: '',
    primaryGame: 'Valorant',
    role: 'player'
  });

  const [googleToken, setGoogleToken] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { register, googleLogin, error, user, setError } = useContext(AuthContext);
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
    if (success) navigate('/home');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // Attempt standard login first in case they already have an account
    const success = await googleLogin({ token: credentialResponse.credential });
    
    // If it fails with "Please provide Gamer Tag", we need to show the modal
    if (!success) {
      setGoogleToken(credentialResponse.credential);
      setShowGoogleModal(true);
      setError(null); // Clear the error from the background attempt
    } else {
      navigate('/home');
    }
  };

  const handleGoogleComplete = async (e) => {
    e.preventDefault();
    const success = await googleLogin({
      token: googleToken,
      gamerTag: formData.gamerTag,
      primaryGame: formData.primaryGame,
      role: formData.role
    });
    if (success) navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ position: 'relative' }}>
        <h2 className="auth-title">Join EsportsConnect</h2>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        {/* Google OAuth Component */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google Login Failed');
            }}
            theme="filled_black"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--color-text-secondary)' }}>
          — OR —
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="gamerTag">Gamer Tag</label>
            <input type="text" id="gamerTag" name="gamerTag" value={formData.gamerTag} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label htmlFor="primaryGame">Primary Game</label>
            <select id="primaryGame" name="primaryGame" value={formData.primaryGame} onChange={handleChange}>
              <option value="Valorant">Valorant</option>
              <option value="BGMI">BGMI</option>
            </select>
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

        {/* Modal for Google Sign-In Missing Details */}
        {showGoogleModal && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'var(--color-bg-card)', borderRadius: 'var(--border-radius)',
            padding: '2rem', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-accent-primary)' }}>One Last Step!</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Google gave us your email, but we need your Gamer Tag and Game to build your profile.
            </p>
            <form onSubmit={handleGoogleComplete}>
              <div className="form-group">
                <label>Gamer Tag</label>
                <input type="text" name="gamerTag" value={formData.gamerTag} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Primary Game</label>
                <select name="primaryGame" value={formData.primaryGame} onChange={handleChange}>
                  <option value="Valorant">Valorant</option>
                  <option value="BGMI">BGMI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="player">Player</option>
                  <option value="team_owner">Team Owner</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Complete Profile</button>
              <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowGoogleModal(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
