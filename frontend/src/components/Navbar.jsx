import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--color-bg-card)', 
      borderBottom: '1px solid var(--color-border)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div>
        <Link to={user ? "/home" : "/"} style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
          EsportsConnect
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/home" style={{ color: 'var(--color-text-primary)' }}>Feed</Link>
            <Link to="/players" style={{ color: 'var(--color-text-primary)' }}>Players</Link>
            <Link to="/teams" style={{ color: 'var(--color-text-primary)' }}>Teams</Link>
            <Link to="/recruitment" style={{ color: 'var(--color-text-primary)' }}>Recruitment</Link>
            <Link to="/profile" style={{ color: 'var(--color-text-primary)' }}>Profile</Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
