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

  // Close mobile drawer automatically on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="navbar-sticky-wrapper">
      <header className="navbar">
        {/* Zone 1: Logo */}
        <Link 
          to="/" 
          className="logo" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            minWidth: 'max-content',
            flexShrink: 0
          }}
        >
          <img 
            src="/ლოგო.png" 
            alt="PlayTogether Logo" 
            style={{ width: '42px', height: '42px', objectFit: 'contain' }} 
          />
          <span className="logo-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#ffffff' }}>Play</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.48)' }}>Together</span>
          </span>
        </Link>

        {/* Zone 2: Centered Nav Links (Desktop Only) */}
        <nav className="nav-links desktop-only-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.home}
          </NavLink>
          <NavLink to="/sports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.sports}
          </NavLink>
          <NavLink to="/stadiums" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.stadiums}
          </NavLink>
          <NavLink to="/games" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.findGameBtn}
          </NavLink>
          <NavLink to="/find-players" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.findPlayers}
          </NavLink>
          <NavLink to="/tournaments" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.tournaments}
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            {c.learn}
          </NavLink>
        </nav>

        {/* Zone 3: Right Actions (Desktop Only) */}
        <div className="nav-actions desktop-only-nav">
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/profile" className="username-pill" title="View Profile">
                <span style={{ fontSize: '14px' }}>👤</span>
                <span>{user.name || 'giorgadze1313'}</span>
              </Link>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="login-button" onClick={() => openAuthModal('login')}>
                {c.login}
              </button>
              <button className="signup-button" onClick={() => openAuthModal('register')}>
                {c.signup}
              </button>
            </div>
          )}

          <button className="lang-switcher" onClick={onToggleLanguage}>
            {lang === 'en' ? 'GEO' : 'ENG'}
          </button>
        </div>

        {/* Mobile Right Controls (< 1100px) */}
        <div className="mobile-only-controls" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <button className="lang-switcher" onClick={onToggleLanguage}>
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
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 999,
            padding: '24px 20px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
          </nav>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

          {/* User / Auth Actions in Mobile Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="username-pill"
                  style={{ justifyContent: 'center', height: '44px', width: '100%' }}
                >
                  <span>👤</span>
                  <span>{user.name || 'giorgadze1313'}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    height: '44px',
                    background: 'rgba(255, 77, 77, 0.15)',
                    color: '#ff4d4d',
                    border: '1px solid rgba(255, 77, 77, 0.3)',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
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
    </div>
  );
};

export default Header;
