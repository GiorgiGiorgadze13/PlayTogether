import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface AboutFeaturesSectionProps {
  c: TranslationContent;
}

interface FeatureItem {
  icon: string;
  title: string;
  badge: string;
  description: string;
}

const PLATFORM_FEATURES: FeatureItem[] = [
  {
    icon: '🏟️',
    title: 'Google Places Stadium Integration',
    badge: 'Real Venues',
    description:
      'Search real sports venues and courts in Tbilisi with high-resolution photo galleries, location maps, and pricing details.',
  },
  {
    icon: '⚡',
    title: 'Interactive 2-Hour Time Slot Grid',
    badge: 'Live Availability',
    description:
      'Instantly check real-time venue availability with visual badges (🟢 AVAILABLE vs 🔴 BOOKED) across 7 upcoming days.',
  },
  {
    icon: '🏆',
    title: 'Multi-Sport Tournament Leagues',
    badge: 'Prize Pools',
    description:
      'Compete in local championships and tournaments for Football, Tennis, Basketball, Volleyball, Rugby, and Badminton.',
  },
  {
    icon: '👥',
    title: 'Real-Time Capacity & Player Roster',
    badge: 'Roster Tracking',
    description:
      'Track player registration progress bars, sport-specific max capacities, and see registered player names.',
  },
  {
    icon: '👤',
    title: 'Personal Athlete Profile Dashboard',
    badge: 'My Bookings',
    description:
      'Access your personal profile to manage created stadium bookings, view joined matches, and review match statistics.',
  },
  {
    icon: '🌐',
    title: 'Bilingual Language Support (ENG / GEO)',
    badge: 'Full Localization',
    description:
      'Seamlessly switch between Georgian and English languages across the entire application.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How do I book a stadium or create a new match?',
    answer:
      'Navigate to the Sports page, select your preferred sport (Football, Tennis, Basketball, etc.), choose a stadium venue, select your date and 2-hour time slot, and click "Publish Match".',
  },
  {
    question: 'Are external Google Places venues supported?',
    answer:
      'Yes! You can search any real sports stadium or court in Tbilisi. When you book an external venue, PlayTogether automatically persists the stadium record in real time.',
  },
  {
    question: 'How do I join an existing match created by another player?',
    answer:
      'Browse the Games page or Home page, click on any open game with available spots, and click "Join Game". You will be instantly added to the match roster.',
  },
  {
    question: 'Can I leave a match if my plans change?',
    answer:
      'Yes! You can manage all your bookings and joined games in your personal Profile page (`/profile`) and click "Leave Match".',
  },
];

export const AboutFeaturesSection: React.FC<AboutFeaturesSectionProps> = ({ c }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#ffffff' }}>
      {/* Hero Mission Statement */}
      <div
        style={{
          background: 'linear-gradient(135deg, #151719 0%, #0d0f11 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '50px',
          textAlign: 'center',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '2px', textTransform: 'uppercase' }}>
          ABOUT PLAYTOGETHER
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0 16px', color: '#fff', letterSpacing: '-1px' }}>
          Connecting Athletes & Elevating Sports in Georgia
        </h1>
        <p
          style={{
            maxWidth: '780px',
            margin: '0 auto 28px',
            fontSize: '16px',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          PlayTogether is Georgia's modern sports community platform. We bridge the gap between amateur players, local teams, and certified stadium venues. Our mission is to make finding, booking, and playing sports seamless for everyone.
        </p>

        {/* Platform Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div style={{ background: '#0d0f11', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#c9ff35' }}>24+</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 600 }}>Tbilisi Venues</div>
          </div>
          <div style={{ background: '#0d0f11', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#4cc9f0' }}>850+</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 600 }}>Active Athletes</div>
          </div>
          <div style={{ background: '#0d0f11', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffb703' }}>120+</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 600 }}>Weekly Matches</div>
          </div>
          <div style={{ background: '#0d0f11', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#f72585' }}>6</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 600 }}>Sports Categories</div>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '2px', textTransform: 'uppercase' }}>
            PLATFORM CAPABILITIES
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, margin: '8px 0', color: '#fff' }}>
            Everything You Need to Organize & Join Sports
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {PLATFORM_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              style={{
                background: '#151719',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '36px' }}>{feat.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#c9ff35',
                    background: 'rgba(201, 255, 53, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {feat.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>{feat.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, margin: 0 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div style={{ marginBottom: '60px', background: '#151719', borderRadius: '24px', padding: '36px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '2px', textTransform: 'uppercase' }}>
            QUESTIONS & ANSWERS
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', color: '#fff' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '840px', margin: '0 auto' }}>
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: '#0d0f11',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>❓ {faq.question}</span>
                  <span style={{ fontSize: '18px', color: '#c9ff35' }}>{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(201,255,53,0.15) 0%, rgba(13,15,17,0.95) 100%)',
          border: '2px solid #c9ff35',
          borderRadius: '24px',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px', color: '#fff' }}>
          Ready to Book Your Next Stadium Match?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
          Explore sports venues across Tbilisi, pick your preferred 2-hour time slot, and bring your team together.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            to="/sports"
            style={{
              padding: '14px 32px',
              background: '#c9ff35',
              color: '#070809',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            Browse Stadiums →
          </Link>
          <Link
            to="/games"
            style={{
              padding: '14px 32px',
              background: '#151719',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            View Upcoming Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutFeaturesSection;
