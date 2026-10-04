import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { Stadium } from '../types/api';
import { api } from '../services/api';
import { StadiumBookingModal } from './StadiumBookingModal';

interface SportsSectionProps {
  c: TranslationContent;
}

const FALLBACK_STADIUMS: Stadium[] = [
  {
    id: 'stadium-football-1',
    name: 'Tbilisi Sports Arena',
    description: 'Modern indoor sports arena with high quality turf and illumination.',
    location: 'Tbilisi, Saburtalo',
    sport: 'Football',
    imageUrl: '/ფეხბურთი.png',
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-rugby-1',
    name: 'Shevardeni Rugby Stadium',
    description: 'Professional grass rugby pitch with grandstand seating.',
    location: 'Tbilisi, Bagebi',
    sport: 'Rugby',
    imageUrl: '/რაგბი.png',
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-basketball-1',
    name: 'Vake Sports Hall',
    description: 'Full sized wooden hardwood basketball court with scoreboard.',
    location: 'Tbilisi, Vake',
    sport: 'Basketball',
    imageUrl: '/კალათბურთი.png',
    price: 10.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-volleyball-1',
    name: 'New Volleyball Arena',
    description: 'Professional indoor volleyball court with spectator seating.',
    location: 'Tbilisi, Digomi',
    sport: 'Volleyball',
    imageUrl: '/ფრენბურთი.png',
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-tennis-1',
    name: 'Mziuri Tennis Courts',
    description: 'Outdoor clay tennis court surrounded by nature.',
    location: 'Tbilisi, Mziuri',
    sport: 'Tennis',
    imageUrl: '/ტენისი.png',
    price: 30.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-badminton-1',
    name: 'Central Badminton Complex',
    description: 'Indoor badminton facility with 4 professional courts.',
    location: 'Tbilisi, Isani',
    sport: 'Badminton',
    imageUrl: '/ბანბიგტონი.png',
    price: 20.0,
    createdAt: new Date().toISOString(),
  },
];

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
        setStadiums(res.stadiums && res.stadiums.length > 0 ? res.stadiums : FALLBACK_STADIUMS);
      } catch {
        // Fallback to default stadiums gracefully when offline / backend not deployed yet
        setStadiums(FALLBACK_STADIUMS);
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
