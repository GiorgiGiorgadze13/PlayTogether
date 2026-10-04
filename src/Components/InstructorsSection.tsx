import React, { useState } from 'react';
import { LEARN_SPORTS, type LearnSport } from '../constants/instructors';
import type { TranslationContent } from '../types/translations';
import { InstructorModal } from './InstructorModal';

interface InstructorsSectionProps {
  c: TranslationContent;
}

export const InstructorsSection: React.FC<InstructorsSectionProps> = ({ c }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'racket' | 'team' | 'combat'>('all');
  const [selectedSport, setSelectedSport] = useState<LearnSport | null>(null);

  const filteredSports = LEARN_SPORTS.filter((sport) => {
    if (activeCategory === 'all') return true;
    return sport.category === activeCategory;
  });

  return (
    <section className="content-section" id="learn" style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 100px' }}>
      {/* Section Header */}
      <div className="section-heading" style={{ marginBottom: '36px', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#c9ff35', textTransform: 'uppercase' }}>
            ⚡ {c.learnEyebrow}
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '6px 0 10px', color: '#fff' }}>
            {c.learnTitle}
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '680px', lineHeight: 1.6 }}>
            {c.learnSubtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: activeCategory === 'all' ? '#c9ff35' : '#151719',
              color: activeCategory === 'all' ? '#070809' : '#fff',
              border: `1px solid ${activeCategory === 'all' ? '#c9ff35' : 'rgba(255,255,255,0.12)'}`,
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🏆 {c.filterAll}
          </button>
          <button
            onClick={() => setActiveCategory('racket')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: activeCategory === 'racket' ? '#c9ff35' : '#151719',
              color: activeCategory === 'racket' ? '#070809' : '#fff',
              border: `1px solid ${activeCategory === 'racket' ? '#c9ff35' : 'rgba(255,255,255,0.12)'}`,
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🎾 {c.filterRacket}
          </button>
          <button
            onClick={() => setActiveCategory('team')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: activeCategory === 'team' ? '#c9ff35' : '#151719',
              color: activeCategory === 'team' ? '#070809' : '#fff',
              border: `1px solid ${activeCategory === 'team' ? '#c9ff35' : 'rgba(255,255,255,0.12)'}`,
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ⚽ {c.filterTeam}
          </button>
          <button
            onClick={() => setActiveCategory('combat')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: activeCategory === 'combat' ? '#c9ff35' : '#151719',
              color: activeCategory === 'combat' ? '#070809' : '#fff',
              border: `1px solid ${activeCategory === 'combat' ? '#c9ff35' : 'rgba(255,255,255,0.12)'}`,
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🥊 {c.filterCombat}
          </button>
        </div>
      </div>

      {/* Grid of Sport Learning Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px',
        }}
      >
        {filteredSports.map((sport) => (
          <div
            key={sport.id}
            className="sport-card-box"
            style={{
              background: '#151719',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 14px 35px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Visual Card Image Header */}
            <div style={{ position: 'relative', height: '210px', width: '100%', overflow: 'hidden', background: '#1c1f22' }}>
              <img
                src={sport.imageUrl}
                alt={sport.name}
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
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(7, 8, 9, 0.3) 0%, rgba(21, 23, 25, 0.95) 100%)',
                }}
              />

              {/* Sport Icon Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(7, 8, 9, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#c9ff35',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(201, 255, 53, 0.35)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ fontSize: '18px' }}>{sport.icon}</span>
                {sport.name.toUpperCase()}
              </div>

              {/* Price Pill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '16px',
                  background: '#c9ff35',
                  color: '#070809',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 900,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                }}
              >
                From ₾{sport.minPrice} / hr
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
                {sport.name}
              </h3>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#c9ff35', marginBottom: '12px' }}>
                {sport.tagline}
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 16px', lineHeight: 1.5, flex: 1 }}>
                {sport.description}
              </p>

              {/* Popular Skills / Topics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {sport.popularTopics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.75)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    ✨ {topic}
                  </span>
                ))}
              </div>

              {/* Instructor Avatars Preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0d0f11',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {sport.instructors.map((ins, idx) => (
                    <img
                      key={ins.id}
                      src={ins.avatarUrl}
                      alt={ins.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #151719',
                        marginLeft: idx > 0 ? '-10px' : 0,
                      }}
                    />
                  ))}
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginLeft: '10px' }}>
                    {sport.availableInstructorsCount}+ Coaches
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#c9ff35', fontWeight: 800 }}>
                  1-on-1 & Group
                </span>
              </div>

              {/* Dual Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => setSelectedSport(sport)}
                  style={{
                    height: '44px',
                    background: 'rgba(201, 255, 53, 0.12)',
                    color: '#c9ff35',
                    border: '1px solid rgba(201, 255, 53, 0.3)',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {c.findInstructor}
                </button>
                <button
                  onClick={() => setSelectedSport(sport)}
                  style={{
                    height: '44px',
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {c.startLearning} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructor Discovery Modal */}
      {selectedSport && (
        <InstructorModal
          sport={selectedSport}
          onClose={() => setSelectedSport(null)}
          c={c}
        />
      )}
    </section>
  );
};

export default InstructorsSection;
