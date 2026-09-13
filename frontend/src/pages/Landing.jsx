import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '2rem 5%',
        background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.15) 0%, var(--color-bg-main) 70%)',
        position: 'relative'
      }}>
        
        {/* Left Side: Copy & CTA */}
        <div style={{ flex: 1, zIndex: 10, maxWidth: '600px' }} className="animate-fade-in-up">
          <h1 style={{ 
            fontSize: '4.5rem', 
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #ffffff, #9ca3af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            <span className="typewriter-text">DOMINATE THE LOBBY.</span>
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
            The ultimate professional network for Valorant and BGMI players. Find elite teammates, join competitive rosters, and get discovered.
          </p>
          
          <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/register" className="btn btn-primary glow-effect" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Create Profile
            </Link>
            <Link to="/teams" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Find a Team
            </Link>
          </div>
        </div>

        {/* Right Side: Floating Assets */}
        <div className="animate-fade-in-up delay-300" style={{ flex: 1, position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'rgba(220, 38, 38, 0.2)',
            filter: 'blur(100px)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>

          <img 
            src="/images/valorant.jpg" 
            alt="Valorant Vandal" 
            className="animate-float"
            style={{ 
              width: '450px', 
              position: 'absolute', 
              top: '10%', 
              right: '5%', 
              zIndex: 2, 
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }} 
          />
          <img 
            src="/images/bgmi.jpg" 
            alt="BGMI Helmet" 
            className="animate-float-delayed"
            style={{ 
              width: '300px', 
              position: 'absolute', 
              bottom: '5%', 
              left: '10%', 
              zIndex: 3, 
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }} 
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="container" style={{ padding: '6rem 1.5rem' }}>
        <h2 className="animate-fade-in-up delay-200" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', letterSpacing: '-0.5px' }}>YOUR ARSENAL FOR SUCCESS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="card animate-fade-in-up delay-200" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>🎯</div>
            <h3 style={{ color: 'var(--color-accent-primary)' }}>Elite Profiles</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Showcase your rank, roles, and signature agents/loadouts to attract top-tier organizations.</p>
          </div>
          
          <div className="card animate-fade-in-up delay-300" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>⚡</div>
            <h3 style={{ color: 'var(--color-accent-primary)' }}>Smart Matchmaking</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Our algorithm analyzes playstyles and missing roles to build the perfect synergy for your roster.</p>
          </div>
          
          <div className="card animate-fade-in-up delay-400" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>🏆</div>
            <h3 style={{ color: 'var(--color-accent-primary)' }}>Scout & Recruit</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Post LFP (Looking For Player) ads with specific competitive requirements and instantly receive applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
