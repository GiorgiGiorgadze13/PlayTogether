import React from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface FooterProps {
  c: TranslationContent;
}

export const Footer: React.FC<FooterProps> = ({ c }) => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/ლოგო.png" 
              alt="PlayTogether Logo" 
              style={{ width: '38px', height: '38px', objectFit: 'contain', marginLeft: '-10px' }} 
            />
            <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 'bold', marginLeft: '-4px' }}>
              <span style={{ color: '#ffffff' }}>Play</span>
              <span style={{ color: '#888888' }}>Together</span>
            </span>
          </Link>
          <p>{c.footerDesc}</p>
        </div>
        <div className="footer-column">
          <span>{c.explore}</span>
          <Link to="/sports">{c.sports}</Link>
          <Link to="/games">{c.findGameBtn}</Link>
          <Link to="/find-players">{c.findPlayers}</Link>
          <Link to="/learn">{c.learn}</Link>
          <Link to="/tournaments">{c.tournaments}</Link>
        </div>
        <div className="footer-column">
          <span>{c.company}</span>
          <Link to="/about">{c.about}</Link>
          <Link to="/about">{c.contact}</Link>
        </div>
        <div className="footer-column">
          <span>{c.account}</span>
          <a href="#">{c.login}</a>
          <a href="#">{c.signup}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PlayTogether</span>
        <span>{c.rights}</span>
      </div>
    </footer>
  );
};

export default Footer;
