import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Discover Players',
    desc: 'Search and filter players by game, role, rank, and region. Find the exact talent your roster needs.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Build Your Team',
    desc: 'Create a team page, define open roles, and recruit players who fit your playstyle and competitive goals.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Get Recruited',
    desc: 'Showcase your esports resume and let organizations discover you. Apply to open positions in seconds.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Direct Messaging',
    desc: 'Connect instantly with players and teams. Discuss terms, schedule scrims, and build your network.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Esports Profiles',
    desc: 'Your professional esports resume. Highlight rank, roles, signature agents, skills, and achievements.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Recruitment Board',
    desc: 'Browse open positions from competitive teams and organizations actively looking for talent right now.',
  },
];

const GAMES = [
  { name: 'Valorant', color: 'var(--valorant)', muted: 'var(--valorant-muted)' },
  { name: 'BGMI', color: 'var(--bgmi)', muted: 'var(--bgmi-muted)' },
];

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) return <Navigate to="/home" />;

  return (
    <div>
      {/* ——— HERO ——— */}
      <section className="hero">
        <span className="hero__eyebrow">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }}></span>
          Built for competitive players
        </span>

        <h1 className="hero__title">
          The professional network<br />for <strong>esports athletes</strong>
        </h1>

        <p className="hero__sub">
          EsportsConnect is where Valorant and BGMI players discover teams, get recruited, and build competitive rosters. Your esports career starts here.
        </p>

        <div className="hero__cta">
          <Link to="/register" className="btn btn-primary btn--xl">
            Create your profile
          </Link>
          <Link to="/players" className="btn btn-secondary btn--xl">
            Browse players
          </Link>
        </div>

        {/* Game badges */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-12)', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {GAMES.map(g => (
            <span
              key={g.name}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${g.color}33`,
                background: g.muted,
                color: g.color,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {g.name}
            </span>
          ))}
          <span style={{
            padding: 'var(--space-2) var(--space-5)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-muted)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-tertiary)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            More coming soon
          </span>
        </div>
      </section>

      {/* ——— HOW IT WORKS ——— */}
      <section className="landing-section landing-section--alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className="section-label" style={{ marginBottom: 'var(--space-3)', justifyContent: 'center', display: 'flex' }}>
              How it works
            </p>
            <h2 className="text-h1">The core product loop</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-1)' }}>
            {['Discover', 'Evaluate', 'Connect', 'Recruit', 'Build'].map((step, i) => (
              <div
                key={step}
                style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  borderRight: i < 4 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: i === 4 ? 'var(--brand)' : 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: i === 4 ? 'white' : 'var(--text-secondary)',
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: i === 4 ? 'var(--brand)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FEATURES ——— */}
      <section className="landing-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p className="section-label" style={{ marginBottom: 'var(--space-3)', justifyContent: 'center', display: 'flex' }}>
              Platform features
            </p>
            <h2 className="text-h1">Everything you need to go pro</h2>
          </div>

          <div className="feature-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA BANNER ——— */}
      <section className="landing-section landing-section--alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="text-h1" style={{ marginBottom: 'var(--space-4)' }}>
            Ready to find your team?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 'var(--space-8)' }}>
            Join thousands of Valorant and BGMI players building their competitive careers.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn--lg">
              Create free profile
            </Link>
            <Link to="/login" className="btn btn-secondary btn--lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="landing-footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="navbar__logo-dot"></span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                EsportsConnect
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} EsportsConnect. Built for competitive players.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
              <Link to="/players" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Players</Link>
              <Link to="/teams" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Teams</Link>
              <Link to="/recruitment" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Recruit</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
