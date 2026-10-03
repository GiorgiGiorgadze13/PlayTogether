import React from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface HeroProps {
  c: TranslationContent;
}

export const Hero: React.FC<HeroProps> = ({ c }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot"></span>
          {c.eyebrow}
        </div>

        <h1>
          {c.heroTitle1}
          <br />
          <span>{c.heroTitle2}</span>
        </h1>

        <p className="hero-description">{c.heroDesc}</p>

        <div className="hero-buttons">
          <Link to="/games" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{c.findGameBtn}</span>
            <strong>↗</strong>
          </Link>
          <Link to="/games" className="secondary-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {c.createGameBtn}
          </Link>
        </div>

        <div className="hero-meta">
          <div className="meta-item">
            <strong>120+</strong>
            <span>{c.gamesThisWeek}</span>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <strong>850+</strong>
            <span>{c.activePlayers}</span>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <strong>24</strong>
            <span>{c.sportsVenues}</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-glow"></div>
        <div className="visual-circle visual-circle-one"></div>
        <div className="visual-circle visual-circle-two"></div>
        
        <div className="sport-orbit orbit-one"><div className="sport-object football-object">⚽</div></div>
        <div className="sport-orbit orbit-two"><div className="sport-object basketball-object">🏀</div></div>
        <div className="sport-orbit orbit-three"><div className="sport-object volleyball-object">🏐</div></div>
        <div className="sport-orbit orbit-four"><div className="sport-object rugby-object">🏉</div></div>
        <div className="sport-orbit orbit-five"><div className="sport-object tennis-object">🎾</div></div>
        <div className="sport-orbit orbit-six"><div className="sport-object badminton-object">🏸</div></div>

        <div className="hero-center">
          <div className="center-small">PLAY</div>
          <div className="center-title">TOGETHER</div>
          <div className="center-line"></div>
          <div className="center-caption">YOUR GAME. YOUR PEOPLE.</div>
        </div>
        <div className="visual-label label-top">MULTI-SPORT</div>
        <div className="visual-label label-bottom">6 SPORTS</div>
      </div>
    </section>
  );
};

export default Hero;
