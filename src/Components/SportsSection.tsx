import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import { SPORT_REQUIREMENTS, type SportRequirement } from '../constants/sports';
import { StadiumBookingModal } from './StadiumBookingModal';

interface SportsSectionProps {
  c: TranslationContent;
}

export const SportsSection: React.FC<SportsSectionProps> = ({ c }) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Convert SPORT_REQUIREMENTS map to array for display
  const sportsList: SportRequirement[] = Object.values(SPORT_REQUIREMENTS);

  return (
    <section className="content-section" id="sports" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div className="section-heading" style={{ marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#c9ff35', textTransform: 'uppercase' }}>
            CHOOSE YOUR SPORT
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '6px 0 10px', color: '#fff' }}>
            Browse Sports & Book Matches
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '640px' }}>
            Select your favorite sport to view filtered stadium fields, courts, date availability, and open time slots in Tbilisi.
          </p>
        </div>
        <Link
          to="/stadiums"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#c9ff35',
            fontWeight: 800,
            fontSize: '14px',
            textDecoration: 'none',
            background: 'rgba(201,255,53,0.1)',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(201,255,53,0.25)',
          }}
        >
          View All Stadiums <span>→</span>
        </Link>
      </div>

      {/* Grid of Sport Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {sportsList.map((sportItem) => {
          return (
            <div
              key={sportItem.id}
              onClick={() => setSelectedSport(sportItem.name)}
              className="sport-card-box"
              style={{
                background: '#151719',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                position: 'relative',
              }}
            >
              {/* Sport Image Header */}
              <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden', background: '#1c1f22' }}>
                <img
                  src={sportItem.imageUrl}
                  alt={sportItem.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(7, 8, 9, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#c9ff35',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(201, 255, 53, 0.35)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{sportItem.icon}</span>
                  {sportItem.name.toUpperCase()}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: '#c9ff35',
                    color: '#070809',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 900,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  👥 {sportItem.maxPlayers} MAX PLAYERS
                </div>
              </div>

              {/* Card Body Info */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    {sportItem.name}
                  </h3>
                  <span style={{ fontSize: '18px', color: '#c9ff35', fontWeight: 900 }}>↗</span>
                </div>

                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 16px', lineHeight: 1.45, flex: 1 }}>
                  {sportItem.description}
                </p>

                {/* Booking Steps Flow Indicator */}
                <div
                  style={{
                    background: '#0d0f11',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ⚡ BOOKING FLOW
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#c9ff35',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ background: 'rgba(201, 255, 53, 0.14)', padding: '3px 8px', borderRadius: '6px' }}>
                      1. Venue
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>→</span>
                    <span style={{ background: 'rgba(201, 255, 53, 0.14)', padding: '3px 8px', borderRadius: '6px' }}>
                      2. Time Slot
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>→</span>
                    <span style={{ background: 'rgba(201, 255, 53, 0.14)', padding: '3px 8px', borderRadius: '6px' }}>
                      3. Book
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    height: '46px',
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s ease, background 0.2s ease',
                  }}
                >
                  Book {sportItem.name} Stadium →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal with pre-selected Sport */}
      {selectedSport && (
        <StadiumBookingModal
          initialSport={selectedSport}
          onClose={() => setSelectedSport(null)}
          c={c}
        />
      )}
    </section>
  );
};

export default SportsSection;
