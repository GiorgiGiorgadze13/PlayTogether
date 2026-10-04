import React from 'react';
import type { TranslationContent } from '../types/translations';
import { HowItWorksSection } from './HowItWorksSection';

interface FindPlayersSectionProps {
  c: TranslationContent;
}

export const FindPlayersSection: React.FC<FindPlayersSectionProps> = ({ c }) => {
  return (
    <section className="content-section" id="find-players" style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 80px' }}>
      {/* Banner Notice for Future Feature */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(201, 255, 53, 0.1) 0%, rgba(21, 23, 25, 0.95) 100%)',
          border: '1px solid rgba(201, 255, 53, 0.3)',
          borderRadius: '24px',
          padding: '32px 28px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '2px', textTransform: 'uppercase' }}>
            ⚡ FIND PLAYERS & TEAMS
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '6px 0 8px' }}>
            Find Teammates & Connect with Local Athletes
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, maxWidth: '640px' }}>
            Match with players near you based on skill level, sport preference, and schedule. Full matchmaking coming soon!
          </p>
        </div>

        <span
          style={{
            background: '#c9ff35',
            color: '#070809',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          🚀 Feature Coming Soon
        </span>
      </div>

      {/* How it Works Workflow */}
      <HowItWorksSection c={c} />
    </section>
  );
};

export default FindPlayersSection;
