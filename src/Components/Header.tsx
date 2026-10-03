import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { Language, TranslationContent } from '../types/translations';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  lang: Language;
  onToggleLanguage: () => void;
  c: TranslationContent;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLanguage, c }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <header className="navbar">
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

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.home}</NavLink>
        <NavLink to="/sports" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.sports}</NavLink>
        <NavLink to="/games" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.games}</NavLink>
        <NavLink to="/tournaments" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.tournaments}</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>{c.about}</NavLink>
        {isAuthenticated && (
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            My Profile
          </NavLink>
        )}
      </nav>

      <div className="nav-actions">
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
    </header>
  );
};

export default Header;
