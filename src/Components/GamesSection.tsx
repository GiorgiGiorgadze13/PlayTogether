/* oxlint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { Game } from '../types/api';
import { api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSportRequirements, SPORT_REQUIREMENTS } from '../constants/sports';

interface GamesSectionProps {
  c: TranslationContent;
}

const FALLBACK_SPORT_GAMES: Game[] = [
  {
    id: 'game-football-1',
    stadiumId: 'stadium-football-1',
    creatorId: 'user-system',
    title: 'Dinamo Champions 7v7 Football Clash',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '18:00',
    endTime: '20:00',
    maxPlayers: 14,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-football-1',
      name: 'Boris Paichadze Dinamo Arena',
      description: 'Premier Football Field',
      location: 'Tbilisi, Chugureti',
      address: '2 Akaki Tsereteli Ave, Tbilisi',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      price: 15.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p1', gameId: 'game-football-1', userId: 'u1', joinedAt: new Date().toISOString(), user: { id: 'u1', name: 'Giorgi', email: 'g@test.com', createdAt: '' } },
      { id: 'p2', gameId: 'game-football-1', userId: 'u2', joinedAt: new Date().toISOString(), user: { id: 'u2', name: 'Nika', email: 'n@test.com', createdAt: '' } },
      { id: 'p3', gameId: 'game-football-1', userId: 'u3', joinedAt: new Date().toISOString(), user: { id: 'u3', name: 'Sandro', email: 's@test.com', createdAt: '' } },
      { id: 'p4', gameId: 'game-football-1', userId: 'u4', joinedAt: new Date().toISOString(), user: { id: 'u4', name: 'Luka', email: 'l@test.com', createdAt: '' } },
    ],
  },
  {
    id: 'game-tennis-1',
    stadiumId: 'stadium-tennis-1',
    creatorId: 'user-system',
    title: 'Leila Meskhi Singles & Doubles Evening',
    date: new Date(Date.now() + 172800000).toISOString(),
    startTime: '16:00',
    endTime: '18:00',
    maxPlayers: 4,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-tennis-1',
      name: 'Leila Meskhi Tennis Academy',
      description: 'Clay & Hard Tennis Courts',
      location: 'Tbilisi, Marjanishvili',
      address: '18 Marjanishvili St, Tbilisi',
      sport: 'Tennis',
      imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
      price: 30.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p5', gameId: 'game-tennis-1', userId: 'u5', joinedAt: new Date().toISOString(), user: { id: 'u5', name: 'Elena', email: 'e@test.com', createdAt: '' } },
      { id: 'p6', gameId: 'game-tennis-1', userId: 'u6', joinedAt: new Date().toISOString(), user: { id: 'u6', name: 'David', email: 'd@test.com', createdAt: '' } },
    ],
  },
  {
    id: 'game-basketball-1',
    stadiumId: 'stadium-basketball-1',
    creatorId: 'user-system',
    title: 'Olympic Palace 5v5 Basketball League Match',
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: '20:00',
    endTime: '22:00',
    maxPlayers: 10,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-basketball-1',
      name: 'Tbilisi Olympic Palace Arena',
      description: 'Indoor Basketball Arena',
      location: 'Tbilisi, Saburtalo',
      address: 'University St 6, Tbilisi',
      sport: 'Basketball',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      price: 10.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p7', gameId: 'game-basketball-1', userId: 'u7', joinedAt: new Date().toISOString(), user: { id: 'u7', name: 'Levan', email: 'l2@test.com', createdAt: '' } },
      { id: 'p8', gameId: 'game-basketball-1', userId: 'u8', joinedAt: new Date().toISOString(), user: { id: 'u8', name: 'Tornike', email: 't@test.com', createdAt: '' } },
      { id: 'p9', gameId: 'game-basketball-1', userId: 'u9', joinedAt: new Date().toISOString(), user: { id: 'u9', name: 'Beka', email: 'b@test.com', createdAt: '' } },
    ],
  },
  {
    id: 'game-volleyball-1',
    stadiumId: 'stadium-volleyball-1',
    creatorId: 'user-system',
    title: 'Digomi Arena 6v6 Indoor Volleyball Game',
    date: new Date(Date.now() + 259200000).toISOString(),
    startTime: '18:00',
    endTime: '20:00',
    maxPlayers: 12,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-volleyball-1',
      name: 'New Volleyball Arena Digomi',
      description: 'Professional Volleyball Court',
      location: 'Tbilisi, Digomi',
      address: 'Digomi Olympic Complex, Tbilisi',
      sport: 'Volleyball',
      imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
      price: 15.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p10', gameId: 'game-volleyball-1', userId: 'u10', joinedAt: new Date().toISOString(), user: { id: 'u10', name: 'Ana', email: 'a@test.com', createdAt: '' } },
      { id: 'p11', gameId: 'game-volleyball-1', userId: 'u11', joinedAt: new Date().toISOString(), user: { id: 'u11', name: 'Mariam', email: 'm@test.com', createdAt: '' } },
    ],
  },
  {
    id: 'game-rugby-1',
    stadiumId: 'stadium-rugby-1',
    creatorId: 'user-system',
    title: 'Shevardeni Rugby Sevens Training Match',
    date: new Date(Date.now() + 345600000).toISOString(),
    startTime: '15:00',
    endTime: '17:00',
    maxPlayers: 14,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-rugby-1',
      name: 'Shevardeni Rugby Stadium',
      description: 'Full Turf Rugby Ground',
      location: 'Tbilisi, Bagebi',
      address: 'Bagebi Complex, Tbilisi',
      sport: 'Rugby',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
      rating: 4.7,
      price: 15.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p12', gameId: 'game-rugby-1', userId: 'u12', joinedAt: new Date().toISOString(), user: { id: 'u12', name: 'Vano', email: 'v@test.com', createdAt: '' } },
    ],
  },
  {
    id: 'game-badminton-1',
    stadiumId: 'stadium-badminton-1',
    creatorId: 'user-system',
    title: 'Isani Complex Indoor Badminton Challenge',
    date: new Date(Date.now() + 172800000).toISOString(),
    startTime: '19:00',
    endTime: '21:00',
    maxPlayers: 4,
    status: 'UPCOMING',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date().toISOString(),
    stadium: {
      id: 'stadium-badminton-1',
      name: 'Central Badminton Complex',
      description: 'Wooden Floor Badminton Court',
      location: 'Tbilisi, Isani',
      address: '12 Navtlughi St, Tbilisi',
      sport: 'Badminton',
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
      rating: 4.6,
      price: 20.0,
      createdAt: new Date().toISOString(),
    },
    players: [
      { id: 'p13', gameId: 'game-badminton-1', userId: 'u13', joinedAt: new Date().toISOString(), user: { id: 'u13', name: 'Irakli', email: 'i@test.com', createdAt: '' } },
    ],
  },
];

export const GamesSection: React.FC<GamesSectionProps> = ({ c }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ [gameId: string]: string }>({});
  const [processingGameId, setProcessingGameId] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getGames();
      // Combine API games with fallback sport games if few are returned
      const combined = [...res.games];
      for (const fg of FALLBACK_SPORT_GAMES) {
        if (!combined.some((g) => g.id === fg.id || g.title === fg.title)) {
          combined.push(fg);
        }
      }
      setGames(combined);
    } catch {
      setGames(FALLBACK_SPORT_GAMES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleJoinGame = async (gameId: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setProcessingGameId(gameId);
    setActionError((prev) => ({ ...prev, [gameId]: '' }));

    try {
      if (gameId.startsWith('game-')) {
        // Fallback local update
        setGames((prev) =>
          prev.map((g) => {
            if (g.id === gameId) {
              const alreadyJoined = g.players?.some((p) => p.userId === user?.id);
              if (alreadyJoined) return g;
              const newPlayers = [
                ...(g.players || []),
                {
                  id: `p-${Date.now()}`,
                  gameId,
                  userId: user?.id || 'curr-user',
                  joinedAt: new Date().toISOString(),
                  user: { id: user?.id || 'curr-user', name: user?.name || 'You', email: user?.email || '', createdAt: '' },
                },
              ];
              return { ...g, players: newPlayers };
            }
            return g;
          })
        );
      } else {
        await api.joinGame(gameId);
        await fetchGames();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError((prev) => ({ ...prev, [gameId]: err.message }));
      } else {
        setActionError((prev) => ({ ...prev, [gameId]: 'Failed to join game.' }));
      }
    } finally {
      setProcessingGameId(null);
    }
  };

  const handleLeaveGame = async (gameId: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setProcessingGameId(gameId);
    setActionError((prev) => ({ ...prev, [gameId]: '' }));

    try {
      if (gameId.startsWith('game-')) {
        setGames((prev) =>
          prev.map((g) => {
            if (g.id === gameId) {
              const filtered = g.players?.filter((p) => p.userId !== user?.id && p.user?.id !== user?.id) || [];
              return { ...g, players: filtered };
            }
            return g;
          })
        );
      } else {
        await api.leaveGame(gameId);
        await fetchGames();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError((prev) => ({ ...prev, [gameId]: err.message }));
      } else {
        setActionError((prev) => ({ ...prev, [gameId]: 'Failed to leave game.' }));
      }
    } finally {
      setProcessingGameId(null);
    }
  };

  const formatDateStr = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  // Filter games by sport tab
  const filteredGames = games.filter((g) => {
    if (selectedSportFilter === 'All') return true;
    const sportName = g.stadium?.sport || 'Football';
    return sportName.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  return (
    <section className="games-section" id="games">
      <div className="section-heading">
        <div>
          <span>{c.playSoon}</span>
          <h2>{c.upcomingGames}</h2>
        </div>
        <Link to="/games">{c.seeAllGames} <span>→</span></Link>
      </div>

      {/* Sport Category Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedSportFilter('All')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: selectedSportFilter === 'All' ? '#c9ff35' : '#151719',
            color: selectedSportFilter === 'All' ? '#070809' : '#ffffff',
            border: selectedSportFilter === 'All' ? '2px solid #c9ff35' : '1px solid rgba(255,255,255,0.15)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          🌟 All Sports
        </button>
        {Object.values(SPORT_REQUIREMENTS).map((s) => {
          const isSelected = selectedSportFilter.toLowerCase() === s.name.toLowerCase();
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSportFilter(s.name)}
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
              {s.icon} {s.name}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>Loading upcoming sports events & games...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff6b6b' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && filteredGames.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>No matches scheduled for {selectedSportFilter} yet. Select a stadium above to create the first match!</p>
        </div>
      )}

      {!isLoading && !error && filteredGames.length > 0 && (
        <div className="games-grid">
          {filteredGames.map((game) => {
            const isUserJoined = user && game.players?.some((p) => p.userId === user.id || p.user?.id === user.id);
            const playerCount = game.players?.length || 0;
            const stadium = game.stadium;
            const sportReq = getSportRequirements(stadium?.sport || '');
            const maxPlayers = game.maxPlayers || sportReq.maxPlayers || 10;
            const isFull = playerCount >= maxPlayers;
            const remainingSpots = Math.max(0, maxPlayers - playerCount);
            const capacityPercent = Math.min(100, Math.round((playerCount / maxPlayers) * 100));
            const cardPhoto = game.selectedPhotoUrl || stadium?.selectedPhotoUrl || stadium?.imageUrl;

            return (
              <article key={game.id} className="game-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Stadium Photo Banner */}
                {cardPhoto && (
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img
                      src={cardPhoto}
                      alt={stadium?.name || game.title}
                      className="clean-stadium-img"
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', color: '#ffb703', fontWeight: 800 }}>
                      ⭐ {stadium?.rating || 4.7}
                    </div>

                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#c9ff35', color: '#070809', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
                      {sportReq.icon} {stadium?.sport || 'Sports'}
                    </div>
                  </div>
                )}

                <div className="game-card-header">
                  <div className="game-tag">{sportReq.icon} {stadium?.sport || 'Sport'}</div>
                  <span className="spots-badge" style={{ color: isFull ? '#ff6b6b' : '#c9ff35', borderColor: isFull ? 'rgba(255,77,77,0.3)' : 'rgba(201,255,53,0.3)' }}>
                    {playerCount} / {maxPlayers} players
                  </span>
                </div>

                <h3 style={{ margin: '8px 0 12px' }}>{game.title}</h3>

                <div className="game-info">
                  <div>
                    <span>{c.dateTime}</span>
                    <strong>{formatDateStr(game.date)} · {game.startTime} - {game.endTime}</strong>
                  </div>
                  <div>
                    <span>{c.location}</span>
                    <strong>{stadium?.name || 'Sports Venue'} ({stadium?.address || stadium?.location})</strong>
                  </div>
                </div>

                {/* Capacity Progress Bar Component */}
                <div style={{ marginTop: '14px', background: '#0d0f11', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    <span>{sportReq.name} Capacity</span>
                    <span style={{ color: isFull ? '#ff6b6b' : '#c9ff35' }}>
                      {playerCount} / {maxPlayers}
                    </span>
                  </div>

                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${capacityPercent}%`,
                        background: isFull ? '#ff6b6b' : '#c9ff35',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: isFull ? '#ff6b6b' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    {isFull ? '🔴 Game is full' : `🟢 ${remainingSpots} spot${remainingSpots === 1 ? '' : 's'} remaining`}
                  </div>
                </div>

                {actionError[game.id] && (
                  <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                    ⚠️ {actionError[game.id]}
                  </div>
                )}

                <div className="game-card-footer" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <div className="game-price">
                    <strong>₾{stadium?.price || 15}</strong>
                    <span>{c.perPlayer}</span>
                  </div>

                  {isUserJoined ? (
                    <button
                      onClick={() => handleLeaveGame(game.id)}
                      disabled={processingGameId === game.id}
                      style={{
                        background: 'rgba(255, 77, 77, 0.15)',
                        border: '1px solid rgba(255, 77, 77, 0.4)',
                        color: '#ff6b6b',
                      }}
                    >
                      {processingGameId === game.id ? 'Leaving...' : 'Leave Game'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      disabled={processingGameId === game.id || isFull}
                      style={{
                        background: isFull ? '#333' : undefined,
                        color: isFull ? '#888' : undefined,
                        cursor: isFull ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {processingGameId === game.id
                        ? 'Joining...'
                        : isFull
                        ? 'Game Full'
                        : `${c.joinGame}`} <span>↗</span>
                    </button>
                  )}
                </div>

                {/* Player Roster preview */}
                {game.players && game.players.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Registered: </span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>
                      {game.players.map((p) => p.user?.name || 'Player').join(', ')}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GamesSection;
