/* oxlint-disable */
import React, { useState, useEffect } from 'react';
import type { Stadium, AvailabilityResponse } from '../types/api';
import { api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { TranslationContent } from '../types/translations';

interface StadiumBookingModalProps {
  stadium: Stadium | null;
  onClose: () => void;
  c: TranslationContent;
  onBookingSuccess?: () => void;
}

export const StadiumBookingModal: React.FC<StadiumBookingModalProps> = ({
  stadium,
  onClose,
  c,
  onBookingSuccess,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowStr());
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [gameTitle, setGameTitle] = useState('');

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!stadium || !date || !startTime || !endTime) return;

    let isMounted = true;
    const checkSlot = async () => {
      setIsChecking(true);
      setBookingError(null);
      try {
        const res = await api.checkAvailability(stadium.id, date, startTime, endTime);
        if (isMounted) setAvailability(res);
      } catch {
        if (isMounted) setAvailability({ available: false, message: 'Could not verify availability.' });
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkSlot();
    return () => {
      isMounted = false;
    };
  }, [stadium, date, startTime, endTime]);

  if (!stadium) return null;

  const handleBookGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (startTime >= endTime) {
      setBookingError('Start time must be before end time.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createGame({
        stadiumId: stadium.id,
        date,
        startTime,
        endTime,
        title: gameTitle.trim() || `${stadium.sport} Match at ${stadium.name}`,
      });

      setBookingSuccess('Game successfully booked!');
      setTimeout(() => {
        onClose();
        if (onBookingSuccess) onBookingSuccess();
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          setBookingError('This stadium is already booked for this time.');
        } else {
          setBookingError(err.message);
        }
      } else {
        setBookingError('Failed to create booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAvailable = availability?.available === true;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {/* Stadium Header Info */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src={stadium.imageUrl}
            alt={stadium.name}
            style={{ width: '70px', height: '70px', objectFit: 'contain', background: '#0d0f11', borderRadius: '12px', padding: '8px' }}
          />
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {stadium.sport}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '2px 0 4px' }}>{stadium.name}</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>📍 {stadium.location} · ₾{stadium.price}/player</p>
          </div>
        </div>

        {bookingSuccess && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(201, 255, 53, 0.15)',
              border: '1px solid rgba(201, 255, 53, 0.4)',
              borderRadius: '8px',
              color: '#c9ff35',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 600,
            }}
          >
            ✓ {bookingSuccess}
          </div>
        )}

        {bookingError && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 77, 77, 0.15)',
              border: '1px solid rgba(255, 77, 77, 0.4)',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            ⚠️ {bookingError}
          </div>
        )}

        <form onSubmit={handleBookGame} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
              Match Title (Optional)
            </label>
            <input
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              placeholder={`e.g. ${stadium.sport} Match`}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                background: '#0d0f11',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
              Select Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                background: '#0d0f11',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Slot Availability Indicator */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#0d0f11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Slot Status:</span>
            {isChecking ? (
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Checking...</span>
            ) : isAvailable ? (
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(201, 255, 53, 0.15)',
                  color: '#c9ff35',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                }}
              >
                ✓ AVAILABLE
              </span>
            ) : (
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(255, 77, 77, 0.15)',
                  color: '#ff6b6b',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                }}
              >
                ✕ ALREADY BOOKED
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isAvailable || isSubmitting || isChecking}
            style={{
              height: '48px',
              marginTop: '8px',
              background: isAvailable ? '#c9ff35' : '#333',
              color: isAvailable ? '#070809' : '#888',
              fontWeight: 800,
              fontSize: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: isAvailable && !isSubmitting ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting
              ? 'Creating Game...'
              : !isAuthenticated
              ? `Login to ${c.createGameBtn}`
              : c.createGameBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StadiumBookingModal;
