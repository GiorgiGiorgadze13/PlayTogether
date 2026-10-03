import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { Stadium } from '../types/api';
import { api } from '../services/api';
import { StadiumBookingModal } from './StadiumBookingModal';

interface SportsSectionProps {
  c: TranslationContent;
}

export const SportsSection: React.FC<SportsSectionProps> = ({ c }) => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.getStadiums();
        setStadiums(res.stadiums);
      } catch {
        setError('Failed to load stadiums from server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  return (
    <section className="content-section" id="sports">
      <div className="section-heading">
        <div>
          <span>{c.exploreSports}</span>
          <h2>{c.chooseGame}</h2>
        </div>
        <Link to="/sports">{c.viewAllSports} <span>→</span></Link>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>Loading available stadiums...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff6b6b' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && stadiums.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>No stadiums available at the moment.</p>
        </div>
      )}

      {!isLoading && !error && stadiums.length > 0 && (
        <div className="sports-grid">
          {stadiums.map((stadium, index) => {
            const isLarge = index === 0;
            return (
              <article
                key={stadium.id}
                className={`sport-card ${isLarge ? 'sport-card-large' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedStadium(stadium)}
              >
                <div className="sport-card-top">
                  <span className="sport-number">0{index + 1}</span>
                  <span className="sport-arrow">↗</span>
                </div>
                <div className="sport-visual">
                  <img
                    src={stadium.imageUrl}
                    alt={stadium.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="sport-card-info">
                  <h3>{stadium.name}</h3>
                  <p>📍 {stadium.location} · ₾{stadium.price}/player</p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedStadium && (
        <StadiumBookingModal
          stadium={selectedStadium}
          onClose={() => setSelectedStadium(null)}
          c={c}
        />
      )}
    </section>
  );
};

export default SportsSection;
