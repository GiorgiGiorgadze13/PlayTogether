import React from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface SportsSectionProps {
  c: TranslationContent;
}

export const SportsSection: React.FC<SportsSectionProps> = ({ c }) => {
  return (
    <section className="content-section" id="sports">
      <div className="section-heading">
        <div>
          <span>{c.exploreSports}</span>
          <h2>{c.chooseGame}</h2>
        </div>
        <Link to="/sports">{c.viewAllSports} <span>→</span></Link>
      </div>

      <div className="sports-grid">
        {/* 01. Football */}
        <article className="sport-card sport-card-large">
          <div className="sport-card-top"><span className="sport-number">01</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual football-visual">
            <img src="/ფეხბურთი.png" alt="Football" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Football</h3><p>24 games available</p></div>
        </article>

        {/* 02. Basketball */}
        <article className="sport-card">
          <div className="sport-card-top"><span className="sport-number">02</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual basketball-visual">
            <img src="/კალათბურთი.png" alt="Basketball" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Basketball</h3><p>18 games available</p></div>
        </article>

        {/* 03. Volleyball */}
        <article className="sport-card">
          <div className="sport-card-top"><span className="sport-number">03</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual volleyball-visual">
            <img src="/ფრენბურთი.png" alt="Volleyball" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Volleyball</h3><p>12 games available</p></div>
        </article>

        {/* 04. Rugby */}
        <article className="sport-card">
          <div className="sport-card-top"><span className="sport-number">04</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual rugby-visual">
            <img src="/რაგბი.png" alt="Rugby" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Rugby</h3><p>14 games available</p></div>
        </article>

        {/* 05. Tennis */}
        <article className="sport-card">
          <div className="sport-card-top"><span className="sport-number">05</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual tennis-visual">
            <img src="/ტენისი.png" alt="Tennis" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Tennis</h3><p>9 games available</p></div>
        </article>

        {/* 06. Badminton */}
        <article className="sport-card">
          <div className="sport-card-top"><span className="sport-number">06</span><span className="sport-arrow">↗</span></div>
          <div className="sport-visual badminton-visual">
            <img src="/ბანბიგტონი.png" alt="Badminton" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sport-card-info"><h3>Badminton</h3><p>7 games available</p></div>
        </article>
      </div>
    </section>
  );
};

export default SportsSection;
