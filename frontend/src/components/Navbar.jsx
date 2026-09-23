import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/home',        label: 'Home' },
  { to: '/players',     label: 'Players' },
  { to: '/teams',       label: 'Teams' },
  { to: '/recruitment', label: 'Recruit' },
  { to: '/messages',    label: 'Messages' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : user?.gamerTag?.slice(0,2).toUpperCase() || 'EC';

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to={user ? '/home' : '/'} className="navbar__logo">
            <span className="navbar__logo-dot"></span>
            EsportsConnect
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="navbar__nav hide-mobile">
              {NAV_ITEMS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="navbar__actions">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="avatar avatar--sm avatar--brand hide-mobile"
                  title={user.gamerTag || user.name}
                  style={{ textDecoration: 'none' }}
                >
                  {initials}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn--sm hide-mobile"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn--sm hide-mobile">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn--sm">
                  Get started
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            {user && (
              <button
                className="navbar__mobile-toggle show-mobile"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {user && mobileOpen && (
        <div className="navbar__mobile-menu">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <hr className="divider" style={{ margin: '8px 0' }} />
          <NavLink
            to="/profile"
            className="navbar__link"
            onClick={() => setMobileOpen(false)}
          >
            My Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="navbar__link"
            style={{ textAlign: 'left', border: 'none', background: 'none', color: 'var(--text-secondary)', width: '100%' }}
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
