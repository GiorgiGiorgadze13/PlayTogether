import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { Language, TranslationContent } from '../types/translations';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  lang: Language;
  onToggleLanguage: () => void;
  c: TranslationContent;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLanguage, c }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="navbar">
        {/* Logo */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/ლოგო.png" 
            alt="PlayTogether Logo" 
            style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-16px' }} 
          />
          <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '-6px' }}>
            <span style={{ color: '#ffffff' }}>Play</span>
            <span style={{ color: '#888888' }}>Together</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.home}</NavLink>
          <NavLink to="/sports" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.sports}</NavLink>
          <NavLink to="/stadiums" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.stadiums}</NavLink>
          <NavLink to="/games" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.findGameBtn}</NavLink>
          <NavLink to="/find-players" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.findPlayers}</NavLink>
          <NavLink to="/tournaments" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.tournaments}</NavLink>
          <NavLink to="/learn" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.learn}</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.about}</NavLink>
          {isAuthenticated && (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              My Profile
            </NavLink>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div className="nav-actions desktop-only-nav">
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/profile"
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#c9ff35',
                  textDecoration: 'none',
                  background: 'rgba(201, 255, 53, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(201, 255, 53, 0.3)',
                }}
              >
                👤 {user.name}
              </Link>
              <button
                onClick={logout}
                className="login-button"
                style={{ padding: '0 12px', height: '36px', fontSize: '12px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="login-button" onClick={() => openAuthModal('login')}>{c.login}</button>
              <button className="signup-button" onClick={() => openAuthModal('register')}>{c.signup}</button>
            </>
          )}

          <button 
            className="lang-switcher" 
            onClick={onToggleLanguage} 
            style={{ 
              background: 'none', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '6px 12px', 
              borderRadius: '8px', 
              color: '#fff', 
              cursor: 'pointer', 
              marginLeft: '10px',
              fontWeight: 500
            }}
          >
            {lang === 'en' ? 'GEO' : 'ENG'}
          </button>
        </div>

        {/* Mobile Header Right Controls (Lang Switcher + Burger Toggle) */}
        <div className="mobile-only-controls" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <button 
            className="lang-switcher" 
            onClick={onToggleLanguage} 
            style={{ 
              background: 'none', 
              border: '1px solid rgba(255,255,255,0.25)', 
              padding: '6px 12px', 
              borderRadius: '8px', 
              color: '#fff', 
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            {lang === 'en' ? 'GEO' : 'ENG'}
          </button>

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            style={{
              background: '#151719',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#c9ff35',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              cursor: 'pointer',
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(7, 8, 9, 0.96)',
            backdropFilter: 'blur(16px)',
            zIndex: 999,
            padding: '24px 20px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink
              to="/"
              end
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              🏠 {c.home}
            </NavLink>

            <NavLink
              to="/sports"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              ⚽ {c.sports}
            </NavLink>

            <NavLink
              to="/stadiums"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              🏟️ {c.stadiums}
            </NavLink>

            <NavLink
              to="/games"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              🎮 {c.findGameBtn}
            </NavLink>

            <NavLink
              to="/find-players"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              👥 {c.findPlayers}
            </NavLink>

            <NavLink
              to="/tournaments"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              🏆 {c.tournaments}
            </NavLink>

            <NavLink
              to="/learn"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              🥊 {c.learn}
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#c9ff35' : '#151719',
                color: isActive ? '#070809' : '#fff',
                fontWeight: 800,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              ℹ️ {c.about}
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isActive ? '#c9ff35' : '#151719',
                  color: isActive ? '#070809' : '#fff',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                })}
              >
                👤 My Profile
              </NavLink>
            )}
          </nav>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

          {/* Auth Actions in Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  height: '46px',
                  background: '#ff4d4d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Logout ({user.name})
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    height: '44px',
                    background: '#151719',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {c.login}
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    height: '44px',
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {c.signup}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
