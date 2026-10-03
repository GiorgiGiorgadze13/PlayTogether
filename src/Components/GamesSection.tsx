import React from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface GamesSectionProps {
  c: TranslationContent;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ c }) => {
  return (
    <section className="games-section" id="games">
      <div className="section-heading">
        <div>
          <span>{c.playSoon}</span>
          <h2>{c.upcomingGames}</h2>
        </div>
        <Link to="/games">{c.seeAllGames} <span>→</span></Link>
      </div>

      <div className="games-grid">
        <article className="game-card">
          <div className="game-card-header">
            <div className="game-tag">⚽ Football</div>
            <span className="spots-badge">{c.spotsLeft(4)}</span>
          </div>
          <h3>Friday Night Football</h3>
          <div className="game-info">
            <div><span>{c.dateTime}</span><strong>Friday · 20:00</strong></div>
            <div><span>{c.location}</span><strong>Tbilisi Sports Arena</strong></div>
          </div>
          <div className="game-card-footer">
            <div className="game-price"><strong>₾15</strong><span>{c.perPlayer}</span></div>
            <button>{c.joinGame} <span>↗</span></button>
          </div>
        </article>

        <article className="game-card">
          <div className="game-card-header">
            <div className="game-tag">🏉 Rugby</div>
            <span className="spots-badge">{c.spotsLeft(6)}</span>
          </div>
          <h3>Weekend Rugby Match</h3>
          <div className="game-info">
            <div><span>{c.dateTime}</span><strong>Saturday · 15:00</strong></div>
            <div><span>{c.location}</span><strong>Shevardeni Rugby Stadium</strong></div>
          </div>
          <div className="game-card-footer">
            <div className="game-price"><strong>₾15</strong><span>{c.perPlayer}</span></div>
            <button>{c.joinGame} <span>↗</span></button>
          </div>
        </article>

        <article className="game-card">
          <div className="game-card-header">
            <div className="game-tag">🏀 Basketball</div>
            <span className="spots-badge">{c.spotsLeft(3)}</span>
          </div>
          <h3>Weekend Basketball</h3>
          <div className="game-info">
            <div><span>{c.dateTime}</span><strong>Saturday · 16:00</strong></div>
            <div><span>{c.location}</span><strong>Vake Sports Hall</strong></div>
          </div>
          <div className="game-card-footer">
            <div className="game-price"><strong>₾10</strong><span>{c.perPlayer}</span></div>
            <button>{c.joinGame} <span>↗</span></button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default GamesSection;
