import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Game } from '../types/api';
import type { TranslationContent } from '../types/translations';
import { Link, useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  c: TranslationContent;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ c }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'joined'>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchUserGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getGames();
      setGames(res.games || []);
    } catch (err: any) {
      console.error('Failed to load user games:', err);
      setError('Failed to fetch your bookings and matches.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserGames();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', color: '#fff' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Access Required</h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
          Please sign in to view your stadium bookings and registered matches.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          style={{
            padding: '12px 28px',
            background: '#c9ff35',
            color: '#070809',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          {c.login}
        </button>
      </div>
    );
  }

  // Filter user games
  const myCreatedGames = games.filter(
    (g) => g.creatorId === user.id || g.creator?.id === user.id
  );

  const myJoinedGames = games.filter(
    (g) =>
      g.players?.some(
        (p) => p.userId === user.id || p.user?.id === user.id
      ) && !(g.creatorId === user.id || g.creator?.id === user.id)
  );

  const allUserGames = games.filter((g) =>
    g.players?.some((p) => p.userId === user.id || p.user?.id === user.id) ||
    g.creatorId === user.id ||
    g.creator?.id === user.id
  );

  const displayedGames =
    activeTab === 'created'
      ? myCreatedGames
      : activeTab === 'joined'
      ? myJoinedGames
      : allUserGames;

  const handleLeaveGame = async (gameId: string) => {
    try {
      await api.leaveGame(gameId);
      setActionSuccess('Successfully left the match.');
      fetchUserGames();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to leave match');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', color: '#ffffff' }}>
      {/* Profile Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #151719 0%, #0d0f11 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '36px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#c9ff35',
              color: '#070809',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 900,
              boxShadow: '0 8px 24px rgba(201, 255, 53, 0.3)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px' }}>{user.name}</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 8px' }}>
              ✉️ {user.email}
            </p>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#c9ff35',
                background: 'rgba(201, 255, 53, 0.15)',
                padding: '4px 10px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              ACTIVE ATHLETE
            </span>
          </div>
        </div>

        {/* Stats Badges */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: '#0d0f11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 24px',
              textAlign: 'center',
              minWidth: '130px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#c9ff35' }}>
              {allUserGames.length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '2px' }}>
              Total Matches
            </div>
          </div>

          <div
            style={{
              background: '#0d0f11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 24px',
              textAlign: 'center',
              minWidth: '130px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#4cc9f0' }}>
              {myCreatedGames.length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '2px' }}>
              Booked / Created
            </div>
          </div>

          <div
            style={{
              background: '#0d0f11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 24px',
              textAlign: 'center',
              minWidth: '130px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffb703' }}>
              {myJoinedGames.length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '2px' }}>
              Joined Matches
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            padding: '14px 20px',
            background: 'rgba(201, 255, 53, 0.15)',
            border: '1px solid rgba(201, 255, 53, 0.4)',
            borderRadius: '12px',
            color: '#c9ff35',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          ✓ {actionSuccess}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: activeTab === 'all' ? '#c9ff35' : 'transparent',
            color: activeTab === 'all' ? '#070809' : '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          All My Booked Stadiums ({allUserGames.length})
        </button>
        <button
          onClick={() => setActiveTab('created')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: activeTab === 'created' ? '#c9ff35' : 'transparent',
            color: activeTab === 'created' ? '#070809' : '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Created by Me ({myCreatedGames.length})
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: activeTab === 'joined' ? '#c9ff35' : 'transparent',
            color: activeTab === 'joined' ? '#070809' : '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Joined Matches ({myJoinedGames.length})
        </button>
      </div>

      {/* Booked Games Grid */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
          Loading your booked stadiums and matches...
        </div>
      ) : error ? (
        <div style={{ padding: '30px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '12px', color: '#ff6b6b' }}>
          {error}
        </div>
      ) : displayedGames.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: '#151719',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏟️</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No Bookings Found</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
            {activeTab === 'created'
              ? "You haven't booked or created any stadium matches yet."
              : activeTab === 'joined'
              ? "You haven't joined any match slots yet."
              : "You have no active stadium bookings."}
          </p>
          <button
            onClick={() => navigate('/sports')}
            style={{
              padding: '12px 24px',
              background: '#c9ff35',
              color: '#070809',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Browse Stadiums & Book Now →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {displayedGames.map((game) => {
            const isCreator = game.creatorId === user.id || game.creator?.id === user.id;
            const stadiumPhoto =
              game.selectedPhotoUrl ||
              game.stadium?.selectedPhotoUrl ||
              game.stadium?.imageUrl ||
              'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80';

            const stadiumName = game.stadium?.name || 'Sports Stadium';
            const stadiumAddress = game.stadium?.address || game.stadium?.location || 'Tbilisi, Georgia';
            const sportType = game.stadium?.sport || 'Sports';
            const currentRegistered = game.players?.length || 1;
            const maxCapacity = game.maxPlayers || 10;
            const fillPercentage = Math.min(100, Math.round((currentRegistered / maxCapacity) * 100));

            const matchDateStr = new Date(game.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={game.id}
                style={{
                  background: '#151719',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                {/* Stadium Picture Header */}
                <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={stadiumPhoto}
                    alt={stadiumName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#c9ff35',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    🏆 {sportType}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: isCreator ? '#c9ff35' : '#4cc9f0',
                      color: '#070809',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {isCreator ? '👑 CREATOR / BOOKER' : '⚽ JOINED PLAYER'}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                    {game.title || `${sportType} Match`}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
                    📍 {stadiumName} · <span style={{ opacity: 0.8 }}>{stadiumAddress}</span>
                  </p>

                  {/* Date & Time Slot Info */}
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
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>MATCH DATE</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        📅 {matchDateStr}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>TIME SLOT</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#c9ff35', marginTop: '2px' }}>
                        ⏰ {game.startTime} - {game.endTime}
                      </div>
                    </div>
                  </div>

                  {/* Registered Players & Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                        Registered Players
                      </span>
                      <span style={{ fontWeight: 800, color: '#c9ff35' }}>
                        👥 {currentRegistered} / {maxCapacity} Registered
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${fillPercentage}%`,
                          background: '#c9ff35',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    {/* Registered Players List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {game.players && game.players.length > 0 ? (
                        game.players.map((p, idx) => {
                          const pName = p.user?.name || `Player ${idx + 1}`;
                          const isSelf = p.userId === user.id || p.user?.id === user.id;
                          return (
                            <span
                              key={p.id || idx}
                              style={{
                                fontSize: '11px',
                                background: isSelf ? 'rgba(201, 255, 53, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                                border: isSelf ? '1px solid #c9ff35' : '1px solid rgba(255,255,255,0.1)',
                                color: isSelf ? '#c9ff35' : '#ffffff',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: isSelf ? 700 : 500,
                              }}
                            >
                              👤 {pName} {isSelf ? '(You)' : ''}
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                          No players registered yet.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', gap: '10px' }}>
                    {!isCreator && (
                      <button
                        onClick={() => handleLeaveGame(game.id)}
                        style={{
                          flex: 1,
                          height: '38px',
                          background: 'rgba(255, 77, 77, 0.15)',
                          color: '#ff6b6b',
                          border: '1px solid rgba(255, 77, 77, 0.3)',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Leave Match
                      </button>
                    )}
                    <Link
                      to="/games"
                      style={{
                        flex: 1,
                        height: '38px',
                        background: '#0d0f11',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      View All Games →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
