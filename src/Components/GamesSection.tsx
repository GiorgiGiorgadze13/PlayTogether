/* oxlint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { Game } from '../types/api';
import { api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface GamesSectionProps {
  c: TranslationContent;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ c }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ [gameId: string]: string }>({});
  const [processingGameId, setProcessingGameId] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getGames();
      setGames(res.games);
    } catch {
      setError('Failed to fetch upcoming games.');
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
      await api.joinGame(gameId);
      await fetchGames();
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
      await api.leaveGame(gameId);
      await fetchGames();
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

  return (
    <section className="games-section" id="games">
      <div className="section-heading">
        <div>
          <span>{c.playSoon}</span>
          <h2>{c.upcomingGames}</h2>
        </div>
        <Link to="/games">{c.seeAllGames} <span>→</span></Link>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>Loading upcoming games...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff6b6b' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && games.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>No upcoming games found. Select a stadium above to create the first match!</p>
        </div>
      )}

      {!isLoading && !error && games.length > 0 && (
        <div className="games-grid">
          {games.map((game) => {
            const isUserJoined = user && game.players?.some((p) => p.userId === user.id);
            const playerCount = game.players?.length || 0;
            const stadium = game.stadium;
            const sportIcon =
              stadium?.sport === 'Football'
                ? '⚽'
                : stadium?.sport === 'Basketball'
                ? '🏀'
                : stadium?.sport === 'Volleyball'
                ? '🏐'
                : stadium?.sport === 'Rugby'
                ? '🏉'
                : stadium?.sport === 'Tennis'
                ? '🎾'
                : '🏸';

            return (
              <article key={game.id} className="game-card">
                <div className="game-card-header">
                  <div className="game-tag">{sportIcon} {stadium?.sport || 'Sport'}</div>
                  <span className="spots-badge">{playerCount} player{playerCount === 1 ? '' : 's'} joined</span>
                </div>

                <h3>{game.title}</h3>

                <div className="game-info">
                  <div>
                    <span>{c.dateTime}</span>
                    <strong>{formatDateStr(game.date)} · {game.startTime} - {game.endTime}</strong>
                  </div>
                  <div>
                    <span>{c.location}</span>
                    <strong>{stadium?.name || 'Sports Venue'} ({stadium?.location})</strong>
                  </div>
                </div>

                {actionError[game.id] && (
                  <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                    ⚠️ {actionError[game.id]}
                  </div>
                )}

                <div className="game-card-footer" style={{ marginTop: '16px' }}>
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
                      disabled={processingGameId === game.id}
                    >
                      {processingGameId === game.id ? 'Joining...' : `${c.joinGame}`} <span>↗</span>
                    </button>
                  )}
                </div>

                {/* Player Roster preview */}
                {game.players && game.players.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Players: </span>
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
