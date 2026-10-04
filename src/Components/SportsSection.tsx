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
    name: 'Boris Paichadze Dinamo Arena',
    description: 'Premier Football Arena with professional turf, grandstands, and floodlights.',
    location: 'Tbilisi, Chugureti',
    address: '2 Akaki Tsereteli Ave, Tbilisi',
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-rugby-1',
    name: 'Shevardeni Rugby Stadium',
    description: 'Professional grass rugby pitch with seating and spectator facilities.',
    location: 'Tbilisi, Bagebi',
    address: 'Bagebi Complex, Tbilisi',
    sport: 'Rugby',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-basketball-1',
    name: 'Tbilisi Olympic Palace',
    description: 'Indoor hardwood basketball arena with scoreboard and grandstands.',
    location: 'Tbilisi, Saburtalo',
    address: 'University St 6, Tbilisi',
    sport: 'Basketball',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    price: 10.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-volleyball-1',
    name: 'New Volleyball Arena Digomi',
    description: 'Professional indoor volleyball court with spectator seating.',
    location: 'Tbilisi, Digomi',
    address: 'Digomi Olympic Complex, Tbilisi',
    sport: 'Volleyball',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
    price: 15.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-tennis-1',
    name: 'Leila Meskhi Tennis Academy',
    description: 'Clay & Hard Outdoor Tennis Courts surrounded by green nature.',
    location: 'Tbilisi, Marjanishvili',
    address: '18 Marjanishvili St, Tbilisi',
    sport: 'Tennis',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    price: 30.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-badminton-1',
    name: 'Central Badminton Complex',
    description: 'Indoor badminton facility with 4 professional wooden courts.',
    location: 'Tbilisi, Isani',
    address: '12 Navtlughi St, Tbilisi',
    sport: 'Badminton',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
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
                    src={stadium.selectedPhotoUrl || stadium.imageUrl}
                    alt={stadium.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
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
