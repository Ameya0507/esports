import React, { useContext, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Magnetic Button Component
const MagneticButton = ({ children, to, className, style }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = `translate(0px, 0px)`;
    btn.style.transition = 'transform 0.3s ease';
  };

  const handleMouseEnter = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transition = 'none';
  };

  return (
    <div className="magnetic-btn-wrapper" ref={btnRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} style={{ transition: 'transform 0.3s ease' }}>
      <Link to={to} className={className} style={style}>
        {children}
      </Link>
    </div>
  );
};

// Interactive 3D Card Component
const InteractiveCard = ({ children, delayClass }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight effect update
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D Tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef} 
      className={`interactive-card animate-fade-in-up ${delayClass}`} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      <div className="interactive-card-content">
        {children}
      </div>
    </div>
  );
};

const Landing = () => {
  const { user } = useContext(AuthContext);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Generate particles
    const container = particlesRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Randomize position and animation duration
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(particle);
      
      // Remove after animation completes to avoid DOM bloat
      setTimeout(() => {
        if (container.contains(particle)) {
          particle.remove();
        }
      }, 8000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Particles Layer */}
      <div ref={particlesRef} className="particles-container"></div>

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
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
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
            <MagneticButton to="/register" className="btn btn-primary glow-effect" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Create Profile
            </MagneticButton>
            <MagneticButton to="/teams" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Find a Team
            </MagneticButton>
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
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'none'
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
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'none'
            }} 
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="container" style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 10 }}>
        <h2 className="animate-fade-in-up delay-200" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', letterSpacing: '-0.5px' }}>YOUR ARSENAL FOR SUCCESS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          
          <InteractiveCard delayClass="delay-200">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>🎯</div>
              <h3 style={{ color: 'var(--color-accent-primary)' }}>Elite Profiles</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Showcase your rank, roles, and signature agents/loadouts to attract top-tier organizations.</p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard delayClass="delay-300">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>⚡</div>
              <h3 style={{ color: 'var(--color-accent-primary)' }}>Smart Matchmaking</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Our algorithm analyzes playstyles and missing roles to build the perfect synergy for your roster.</p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard delayClass="delay-400">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>🏆</div>
              <h3 style={{ color: 'var(--color-accent-primary)' }}>Scout & Recruit</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Post LFP (Looking For Player) ads with specific competitive requirements and instantly receive applications.</p>
            </div>
          </InteractiveCard>

        </div>
      </div>
    </div>
  );
};

export default Landing;
