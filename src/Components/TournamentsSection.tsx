import React from 'react';
import type { TranslationContent } from '../types/translations';

interface TournamentsSectionProps {
  c: TranslationContent;
}

export const TournamentsSection: React.FC<TournamentsSectionProps> = ({ c }) => {
  return (
    <section className="tournaments-section" id="tournaments">
      <div className="tournament-heading">
        <div>
          <span>{c.comingTogether}</span>
          <h2>{c.playTournament}</h2>
          <p>{c.tournamentDesc}</p>
        </div>
        <button className="outline-button">{c.exploreTournaments} <span>↗</span></button>
      </div>

      <div className="tournament-grid">
        <article className="tournament-card tournament-featured">
          <div className="tournament-card-top"><span>FOOTBALL</span><strong>01</strong></div>
          <div className="tournament-icon">
            <img src="/ბეხბურთიი.png" alt="Football Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>Tbilisi Weekend Cup</h3>
            <p>Saturday · Tbilisi Sports Arena</p>
            <div className="tournament-meta"><span>16 teams</span><span>₾25 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>

        <article className="tournament-card">
          <div className="tournament-card-top"><span>RUGBY</span><strong>02</strong></div>
          <div className="tournament-icon">
            <img src="/რაგბიი.png" alt="Rugby Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>Tbilisi Rugby Sevens</h3>
            <p>Sunday · Shevardeni Stadium</p>
            <div className="tournament-meta"><span>8 teams</span><span>₾20 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>

        <article className="tournament-card">
          <div className="tournament-card-top"><span>BASKETBALL</span><strong>03</strong></div>
          <div className="tournament-icon">
            <img src="/კალათბურთიი.png" alt="Basketball Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>City Basketball Cup</h3>
            <p>Sunday · Vake Sports Hall</p>
            <div className="tournament-meta"><span>8 teams</span><span>₾20 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>

        <article className="tournament-card">
          <div className="tournament-card-top"><span>VOLLEYBALL</span><strong>04</strong></div>
          <div className="tournament-icon">
            <img src="/ფრენბურთიი.png" alt="Volleyball Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>Tbilisi Volleyball Open</h3>
            <p>Saturday · New Volleyball Arena</p>
            <div className="tournament-meta"><span>6 teams</span><span>₾15 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>

        <article className="tournament-card">
          <div className="tournament-card-top"><span>TENNIS</span><strong>05</strong></div>
          <div className="tournament-icon">
            <img src="/ტენისიი.png" alt="Tennis Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>City Tennis Championship</h3>
            <p>Sunday · Mziuri Courts</p>
            <div className="tournament-meta"><span>8 players</span><span>₾30 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>

        <article className="tournament-card">
          <div className="tournament-card-top"><span>BADMINTON</span><strong>06</strong></div>
          <div className="tournament-icon">
            <img src="/ბანბიგტონიი.png" alt="Badminton Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
          </div>
          <div className="tournament-content">
            <h3>Badminton Masters</h3>
            <p>Saturday · Sports Complex</p>
            <div className="tournament-meta"><span>10 players</span><span>₾20 {c.perPlayer}</span></div>
          </div>
          <button>{c.viewTournament}</button>
        </article>
      </div>
    </section>
  );
};

export default TournamentsSection;
