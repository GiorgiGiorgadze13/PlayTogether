import React, { useState } from 'react';
import type { TranslationContent } from '../types/translations';
import { useAuth } from '../context/AuthContext';

interface TournamentsSectionProps {
  c: TranslationContent;
}

interface Tournament {
  id: string;
  number: string;
  sport: string;
  icon: string;
  title: string;
  dateStr: string;
  stadiumName: string;
  stadiumLocation: string;
  stadiumPhoto: string;
  teamsRegistered: number;
  maxTeams: number;
  entryFee: number;
  prizePool: string;
}

const TOURNAMENTS_DATA: Tournament[] = [
  {
    id: 't-1',
    number: '01',
    sport: 'Football',
    icon: '⚽',
    title: 'Tbilisi Weekend Cup 7v7',
    dateStr: 'Oct 18-20, 2026',
    stadiumName: 'Boris Paichadze Dinamo Arena',
    stadiumLocation: 'Tbilisi, Chugureti',
    stadiumPhoto: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 12,
    maxTeams: 16,
    entryFee: 25,
    prizePool: '₾2,500 + Trophy',
  },
  {
    id: 't-2',
    number: '02',
    sport: 'Tennis',
    icon: '🎾',
    title: 'Georgian Tennis Masters Open',
    dateStr: 'Oct 22-24, 2026',
    stadiumName: 'Leila Meskhi Tennis Academy',
    stadiumLocation: 'Tbilisi, Marjanishvili',
    stadiumPhoto: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 10,
    maxTeams: 16,
    entryFee: 35,
    prizePool: '₾1,800 + Racquets',
  },
  {
    id: 't-3',
    number: '03',
    sport: 'Basketball',
    icon: '🏀',
    title: 'Saburtalo 3v3 & 5v5 Hoops Championship',
    dateStr: 'Oct 25-26, 2026',
    stadiumName: 'Tbilisi Olympic Palace Arena',
    stadiumLocation: 'Tbilisi, Saburtalo',
    stadiumPhoto: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 8,
    maxTeams: 12,
    entryFee: 20,
    prizePool: '₾1,500 + Gear',
  },
  {
    id: 't-4',
    number: '04',
    sport: 'Volleyball',
    icon: '🏐',
    title: 'Tbilisi Volleyball Open Masters',
    dateStr: 'Nov 01-03, 2026',
    stadiumName: 'New Volleyball Arena Digomi',
    stadiumLocation: 'Tbilisi, Digomi',
    stadiumPhoto: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 6,
    maxTeams: 8,
    entryFee: 15,
    prizePool: '₾1,000 + Medals',
  },
  {
    id: 't-5',
    number: '05',
    sport: 'Rugby',
    icon: '🏉',
    title: 'Tbilisi Rugby Sevens Autumn Trophy',
    dateStr: 'Nov 07-09, 2026',
    stadiumName: 'Shevardeni Rugby Stadium',
    stadiumLocation: 'Tbilisi, Bagebi',
    stadiumPhoto: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 7,
    maxTeams: 8,
    entryFee: 20,
    prizePool: '₾2,000 + Cup',
  },
  {
    id: 't-6',
    number: '06',
    sport: 'Badminton',
    icon: '🏸',
    title: 'Central Badminton Autumn Open',
    dateStr: 'Nov 12-14, 2026',
    stadiumName: 'Central Badminton Complex',
    stadiumLocation: 'Tbilisi, Isani',
    stadiumPhoto: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    teamsRegistered: 14,
    maxTeams: 16,
    entryFee: 20,
    prizePool: '₾1,200 + Equipment',
  },
];

export const TournamentsSection: React.FC<TournamentsSectionProps> = ({ c }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('All');
  const [joinedTournaments, setJoinedTournaments] = useState<{ [id: string]: boolean }>({});
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const handleRegisterTournament = (tournament: Tournament) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setJoinedTournaments((prev) => ({ ...prev, [tournament.id]: true }));
    setSuccessModal(`Successfully registered team for "${tournament.title}" at ${tournament.stadiumName}!`);
  };

  const filteredTournaments = TOURNAMENTS_DATA.filter((t) => {
    if (selectedSportFilter === 'All') return true;
    return t.sport.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  return (
    <section className="tournaments-section" id="tournaments" style={{ padding: '40px 0' }}>
      <div className="tournament-heading" style={{ marginBottom: '24px' }}>
        <div>
          <span>{c.comingTogether}</span>
          <h2>{c.playTournament}</h2>
          <p>{c.tournamentDesc}</p>
        </div>
      </div>

      {/* Sport Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '28px' }}>
        {['All', 'Football', 'Tennis', 'Basketball', 'Volleyball', 'Rugby', 'Badminton'].map((sport) => {
          const isSelected = selectedSportFilter.toLowerCase() === sport.toLowerCase();
          return (
            <button
              key={sport}
              onClick={() => setSelectedSportFilter(sport)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: isSelected ? '#c9ff35' : '#151719',
                color: isSelected ? '#070809' : '#ffffff',
                border: isSelected ? '2px solid #c9ff35' : '1px solid rgba(255,255,255,0.15)',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {sport === 'All' ? '🏆 All Sports' : sport}
            </button>
          );
        })}
      </div>

      {successModal && (
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(201, 255, 53, 0.15)',
            border: '1px solid rgba(201, 255, 53, 0.4)',
            borderRadius: '12px',
            color: '#c9ff35',
            fontSize: '14px',
            fontWeight: 800,
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>✓ {successModal}</span>
          <button
            onClick={() => setSuccessModal(null)}
            style={{ background: 'none', border: 'none', color: '#c9ff35', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tournament Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredTournaments.map((t) => {
          const isRegistered = joinedTournaments[t.id];
          const isFull = t.teamsRegistered >= t.maxTeams;
          const fillPercent = Math.min(100, Math.round((t.teamsRegistered / t.maxTeams) * 100));

          return (
            <article
              key={t.id}
              style={{
                background: '#151719',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Stadium Photo Banner */}
              <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={t.stadiumPhoto}
                  alt={t.stadiumName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#c9ff35',
                    color: '#070809',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                >
                  {t.icon} {t.sport} TOURNAMENT
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffb703',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  🏆 {t.prizePool}
                </div>
              </div>

              {/* Tournament Details */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
                  📍 <strong>{t.stadiumName}</strong> · {t.stadiumLocation}
                </p>

                {/* Tournament Date & Info Box */}
                <div
                  style={{
                    background: '#0d0f11',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>DATES</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                      📅 {t.dateStr}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>ENTRY FEE</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#c9ff35', marginTop: '2px' }}>
                      ₾{t.entryFee} / player
                    </div>
                  </div>
                </div>

                {/* Registered Teams Progress Bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    <span>Registered Teams / Players</span>
                    <span style={{ color: isFull ? '#ff6b6b' : '#c9ff35' }}>
                      {t.teamsRegistered} / {t.maxTeams} Teams
                    </span>
                  </div>

                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${fillPercent}%`,
                        background: isFull ? '#ff6b6b' : '#c9ff35',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    {isFull ? '🔴 Registration Closed' : `🟢 ${t.maxTeams - t.teamsRegistered} team spots remaining`}
                  </div>
                </div>

                {/* Register Action Button */}
                <button
                  onClick={() => handleRegisterTournament(t)}
                  disabled={isFull || isRegistered}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isRegistered ? 'rgba(201,255,53,0.2)' : isFull ? '#333' : '#c9ff35',
                    color: isRegistered ? '#c9ff35' : isFull ? '#888' : '#070809',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: isFull || isRegistered ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isRegistered ? '✓ Team Registered' : isFull ? 'Registration Full' : 'Register Team for Tournament →'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TournamentsSection;
