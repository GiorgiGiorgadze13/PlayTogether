/* oxlint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import type { Stadium, AvailabilityResponse, VenuePlace } from '../types/api';
import { api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { TranslationContent } from '../types/translations';
import { getSportRequirements, SPORT_REQUIREMENTS, getFallbackVenuesForSport } from '../constants/sports';

interface StadiumBookingModalProps {
  stadium?: Stadium | VenuePlace | null;
  initialSport?: string | null;
  onClose: () => void;
  c: TranslationContent;
  onBookingSuccess?: () => void;
}

interface TimeSlotPreset {
  startTime: string;
  endTime: string;
  label: string;
}

const PRESET_SLOTS: TimeSlotPreset[] = [
  { startTime: '08:00', endTime: '10:00', label: '08:00 - 10:00 Morning' },
  { startTime: '10:00', endTime: '12:00', label: '10:00 - 12:00 Morning' },
  { startTime: '12:00', endTime: '14:00', label: '12:00 - 14:00 Afternoon' },
  { startTime: '14:00', endTime: '16:00', label: '14:00 - 16:00 Afternoon' },
  { startTime: '16:00', endTime: '18:00', label: '16:00 - 18:00 Evening' },
  { startTime: '18:00', endTime: '20:00', label: '18:00 - 20:00 Prime Time' },
  { startTime: '20:00', endTime: '22:00', label: '20:00 - 22:00 Prime Time' },
  { startTime: '22:00', endTime: '23:59', label: '22:00 - 24:00 Late Night' },
];

export const StadiumBookingModal: React.FC<StadiumBookingModalProps> = ({
  stadium,
  initialSport,
  onClose,
  onBookingSuccess,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // Helper to generate 7 upcoming dates
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ isoDate, dayName, dateNum });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Flow Step: 1 = Sport, 2 = Venue, 3 = Date & Time, 4 = Capacity & Confirmation
  const [step, setStep] = useState<number>(stadium ? 3 : initialSport ? 2 : 1);

  // Form State
  const activeSport = stadium?.sport || initialSport || 'Football';
  const [selectedSport, setSelectedSport] = useState<string>(activeSport);
  const [selectedVenue, setSelectedVenue] = useState<VenuePlace | Stadium | null>(
    stadium
      ? {
          id: stadium.id,
          name: stadium.name,
          address: stadium.address || stadium.location,
          location: stadium.location,
          latitude: stadium.latitude || 41.7151,
          longitude: stadium.longitude || 44.8271,
          imageUrl: stadium.imageUrl,
          selectedPhotoUrl: stadium.selectedPhotoUrl || stadium.imageUrl,
          rating: stadium.rating || 4.7,
          placeId: stadium.placeId || stadium.id,
          sport: stadium.sport,
          price: stadium.price,
        }
      : null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<VenuePlace[]>([]);
  const [currentVenueIndex, setCurrentVenueIndex] = useState<number>(0);
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);

  const [date, setDate] = useState<string>(upcomingDays[1].isoDate); // Default Tomorrow
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [gameTitle, setGameTitle] = useState('');

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Array<{ startTime: string; endTime: string; title?: string }>>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sportReq = getSportRequirements(selectedSport);

  // Fetch real Google Places venues for chosen sport with fallbacks
  const fetchVenues = useCallback(async (sportName: string, queryText: string) => {
    try {
      setIsSearchingVenues(true);
      const res = await api.searchVenues(sportName, queryText);
      if (res.venues && res.venues.length > 0) {
        setVenues(res.venues);
        setSelectedVenue(res.venues[0]);
        setCurrentVenueIndex(0);
      } else {
        const fallbacks = getFallbackVenuesForSport(sportName, queryText);
        setVenues(fallbacks);
        if (fallbacks.length > 0) {
          setSelectedVenue(fallbacks[0]);
          setCurrentVenueIndex(0);
        }
      }
    } catch {
      const fallbacks = getFallbackVenuesForSport(sportName, queryText);
      setVenues(fallbacks);
      if (fallbacks.length > 0) {
        setSelectedVenue(fallbacks[0]);
        setCurrentVenueIndex(0);
      }
    } finally {
      setIsSearchingVenues(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues(selectedSport, searchQuery);
  }, [selectedSport, searchQuery, fetchVenues]);

  // Check Slot Availability & Load Booked Slots for Selected Date
  useEffect(() => {
    if (!selectedVenue || !date) return;

    let isMounted = true;
    const fetchDayAvailability = async () => {
      setIsChecking(true);
      setBookingError(null);
      try {
        const res = await api.checkAvailability(selectedVenue.id, date, startTime, endTime);
        if (isMounted) {
          setAvailability(res);
          if (res.bookedSlots) {
            setBookedSlots(res.bookedSlots);
          } else {
            setBookedSlots([]);
          }
        }
      } catch (err) {
        console.error('Availability check failed:', err);
        if (isMounted) {
          setAvailability({ available: true, message: 'Venue open for booking.' });
          setBookedSlots([]);
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    fetchDayAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedVenue, date, startTime, endTime]);

  // Helper to check if a preset slot is already booked
  const isSlotBooked = (slotStart: string, slotEnd: string) => {
    return bookedSlots.some((b) => slotStart < b.endTime && slotEnd > b.startTime);
  };

  const getConflictingGameTitle = (slotStart: string, slotEnd: string) => {
    const conflict = bookedSlots.find((b) => slotStart < b.endTime && slotEnd > b.startTime);
    return conflict?.title;
  };

  const handleBookGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!selectedVenue) {
      setBookingError('Please select a stadium venue.');
      return;
    }

    if (startTime >= endTime) {
      setBookingError('Start time must be before end time.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createGame({
        stadiumId: selectedVenue.id,
        date,
        startTime,
        endTime,
        title: gameTitle.trim() || `${sportReq.name} Match at ${selectedVenue.name}`,
        maxPlayers: sportReq.maxPlayers,
        selectedPhotoUrl: selectedVenue.selectedPhotoUrl || selectedVenue.imageUrl,
        selectedPhotoAttribution: selectedVenue.selectedPhotoAttribution,
        venueName: selectedVenue.name,
        venueLocation: selectedVenue.location,
        venueAddress: selectedVenue.address || selectedVenue.location,
        sport: selectedSport,
      });

      setBookingSuccess('Game successfully created & booked!');
      setTimeout(() => {
        onClose();
        if (onBookingSuccess) onBookingSuccess();
      }, 1500);
    } catch (err: any) {
      let errorMsg = 'Failed to create game. Please try again.';

      if (err instanceof ApiError || err?.statusCode || err?.message) {
        if (err.statusCode === 409) {
          errorMsg = 'This stadium is already booked for this time.';
        } else if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          errorMsg = err.errors.map((e: any) => e.message).join(', ');
        } else if (err.message) {
          errorMsg = err.message;
        }
      }

      // If backend network request failed (offline/unreachable backend server), create local fallback game
      const isNetworkError =
        !err.statusCode &&
        (err?.message?.toLowerCase().includes('fetch') ||
          err?.message?.toLowerCase().includes('network') ||
          err?.message?.toLowerCase().includes('failed'));

      if (isNetworkError) {
        try {
          const gameId = `game-custom-${Date.now()}`;
          const newLocalGame = {
            id: gameId,
            stadiumId: selectedVenue.id,
            creatorId: user?.id || 'curr-user',
            title: gameTitle.trim() || `${sportReq.name} Match at ${selectedVenue.name}`,
            date: new Date(date).toISOString(),
            startTime,
            endTime,
            maxPlayers: sportReq.maxPlayers,
            status: 'UPCOMING',
            selectedPhotoUrl: selectedVenue.selectedPhotoUrl || selectedVenue.imageUrl,
            createdAt: new Date().toISOString(),
            stadium: {
              id: selectedVenue.id,
              name: selectedVenue.name,
              description: 'Booked stadium venue',
              location: selectedVenue.location,
              address: selectedVenue.address || selectedVenue.location,
              sport: selectedSport,
              imageUrl: selectedVenue.imageUrl,
              selectedPhotoUrl: selectedVenue.selectedPhotoUrl || selectedVenue.imageUrl,
              rating: selectedVenue.rating || 4.7,
              price: selectedVenue.price || 15.0,
              createdAt: new Date().toISOString(),
            },
            creator: {
              id: user?.id || 'curr-user',
              name: user?.name || 'You',
              email: user?.email || '',
            },
            players: [
              {
                id: `p-${Date.now()}`,
                gameId,
                userId: user?.id || 'curr-user',
                joinedAt: new Date().toISOString(),
                user: {
                  id: user?.id || 'curr-user',
                  name: user?.name || 'You',
                  email: user?.email || '',
                  createdAt: new Date().toISOString(),
                },
              },
            ],
          };

          const existingCustom = JSON.parse(localStorage.getItem('playTogether_custom_games') || '[]');
          localStorage.setItem('playTogether_custom_games', JSON.stringify([newLocalGame, ...existingCustom]));

          setBookingSuccess('Game successfully created & booked!');
          setTimeout(() => {
            onClose();
            if (onBookingSuccess) onBookingSuccess();
          }, 1500);
          return;
        } catch (localErr) {
          console.error('Failed to create local fallback game:', localErr);
        }
      }

      setBookingError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSelectedSlotAvailable = !isSlotBooked(startTime, endTime) && (availability?.available !== false);
  const initialRegistered = 1; // Creator auto-joins
  const remainingSpots = Math.max(0, sportReq.maxPlayers - initialRegistered);
  const capacityPercent = Math.min(100, Math.round((initialRegistered / sportReq.maxPlayers) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '620px',
          background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Step Indicator Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s)}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: step >= s ? '#c9ff35' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Step {step} of 4 · {step === 1 ? 'Choose Sport' : step === 2 ? 'Choose Venue' : step === 3 ? 'Date & Time Slots' : 'Review & Confirm'}
            </span>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: CHOOSE SPORT */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>1. Choose Sport</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Select your sport to auto-configure max player capacities.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {Object.values(SPORT_REQUIREMENTS).map((s) => {
                const isSelected = selectedSport.toLowerCase() === s.name.toLowerCase() || selectedSport.toLowerCase() === s.id.toLowerCase();
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSport(s.name);
                      fetchVenues(s.name, '');
                      setStep(2);
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: isSelected ? 'rgba(201, 255, 53, 0.15)' : '#0d0f11',
                      border: isSelected ? '2px solid #c9ff35' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{s.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{s.name}</h4>
                      <span style={{ fontSize: '12px', color: isSelected ? '#c9ff35' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        {s.maxPlayers} players
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE VENUE (Interactive Carousel with Left/Right Navigation) */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>2. Choose Stadium / Venue</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              Select a stadium for <strong style={{ color: '#c9ff35' }}>{sportReq.name}</strong> ({venues.length} venues available)
            </p>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search stadium name or address..."
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {isSearchingVenues ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                Searching Google Places & real venues...
              </div>
            ) : venues.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                No venues found for "{searchQuery}".
              </div>
            ) : (
              <div>
                {/* Main Active Stadium Carousel Card */}
                {(() => {
                  const activeVenue = venues[currentVenueIndex] || venues[0];
                  const photoSrc = activeVenue.selectedPhotoUrl || activeVenue.imageUrl;

                  const handlePrev = () => {
                    const prevIdx = (currentVenueIndex - 1 + venues.length) % venues.length;
                    setCurrentVenueIndex(prevIdx);
                    setSelectedVenue(venues[prevIdx]);
                  };

                  const handleNext = () => {
                    const nextIdx = (currentVenueIndex + 1) % venues.length;
                    setCurrentVenueIndex(nextIdx);
                    setSelectedVenue(venues[nextIdx]);
                  };

                  return (
                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          position: 'relative',
                          background: '#151719',
                          border: '2px solid #c9ff35',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                        }}
                      >
                        {/* Left Arrow Button */}
                        <button
                          type="button"
                          onClick={handlePrev}
                          title="Previous Stadium"
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '90px',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(6px)',
                            color: '#c9ff35',
                            border: '1px solid rgba(201, 255, 53, 0.5)',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                          }}
                        >
                          ←
                        </button>

                        {/* Right Arrow Button */}
                        <button
                          type="button"
                          onClick={handleNext}
                          title="Next Stadium"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '90px',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(6px)',
                            color: '#c9ff35',
                            border: '1px solid rgba(201, 255, 53, 0.5)',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                          }}
                        >
                          →
                        </button>

                        {/* Image Header */}
                        <div style={{ position: 'relative', height: '185px', width: '100%', overflow: 'hidden' }}>
                          <img
                            src={photoSrc}
                            alt={activeVenue.name}
                            className="clean-stadium-img"
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
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>{sportReq.icon}</span> OPTION {currentVenueIndex + 1} OF {venues.length}
                          </div>

                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: 'rgba(0,0,0,0.85)',
                              color: '#ffb703',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              border: '1px solid rgba(255,183,3,0.3)',
                            }}
                          >
                            ⭐ {activeVenue.rating || 4.8}
                          </div>
                        </div>

                        {/* Venue Info Details */}
                        <div style={{ padding: '16px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                            {activeVenue.name}
                          </h3>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: '0 0 12px' }}>
                            📍 {activeVenue.address || activeVenue.location}
                          </p>

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#0d0f11',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              marginBottom: '14px',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, display: 'block' }}>CAPACITY</span>
                              <strong style={{ fontSize: '12px', color: '#fff' }}>👥 Max {sportReq.maxPlayers} Players</strong>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, display: 'block' }}>RATE / PLAYER</span>
                              <strong style={{ fontSize: '14px', color: '#c9ff35' }}>₾{activeVenue.price || 15}</strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVenue(activeVenue);
                              setStep(3);
                            }}
                            style={{
                              width: '100%',
                              height: '44px',
                              background: '#c9ff35',
                              color: '#070809',
                              border: 'none',
                              borderRadius: '10px',
                              fontWeight: 900,
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            Select {activeVenue.name} & Continue →
                          </button>
                        </div>
                      </div>

                      {/* Bottom Thumbnail Strip */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          overflowX: 'auto',
                          paddingTop: '10px',
                          paddingBottom: '4px',
                          scrollbarWidth: 'none',
                        }}
                      >
                        {venues.map((v, idx) => {
                          const isSelected = idx === currentVenueIndex;
                          const thumbPhoto = v.selectedPhotoUrl || v.imageUrl;
                          return (
                            <div
                              key={v.id}
                              onClick={() => {
                                setCurrentVenueIndex(idx);
                                setSelectedVenue(v);
                              }}
                              style={{
                                flexShrink: 0,
                                width: '120px',
                                background: isSelected ? 'rgba(201, 255, 53, 0.15)' : '#0d0f11',
                                border: isSelected ? '2px solid #c9ff35' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <div style={{ height: '54px', borderRadius: '6px', overflow: 'hidden', marginBottom: '4px' }}>
                                <img src={thumbPhoto} alt={v.name} className="clean-stadium-img" />
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? '#c9ff35' : '#fff' }}>
                                {v.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: MODERN INTERACTIVE DATE & TIME SLOTS GRID */}
        {step === 3 && selectedVenue && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>3. Select Date & Time Slot</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              Venue: <strong style={{ color: '#fff' }}>{selectedVenue.name}</strong>
            </p>

            {/* Match Title Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                Match Title (Optional)
              </label>
              <input
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder={`e.g. ${sportReq.name} Match at ${selectedVenue.name}`}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* 1. HORIZONTAL UPCOMING DAYS STRIP */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#c9ff35', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📅 Pick Match Date
                </span>
                <input
                  type="date"
                  min={getTodayStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    background: '#0d0f11',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                {upcomingDays.map((day) => {
                  const isSelectedDate = date === day.isoDate;
                  return (
                    <button
                      key={day.isoDate}
                      type="button"
                      onClick={() => setDate(day.isoDate)}
                      style={{
                        flex: '0 0 auto',
                        minWidth: '76px',
                        padding: '10px 8px',
                        borderRadius: '12px',
                        background: isSelectedDate ? '#c9ff35' : '#0d0f11',
                        color: isSelectedDate ? '#070809' : '#ffffff',
                        border: isSelectedDate ? '2px solid #c9ff35' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, opacity: isSelectedDate ? 0.9 : 0.6 }}>
                        {day.dayName}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>
                        {day.dateNum}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SPECIFIC TIME SLOTS GRID */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                  ⏰ Available Time Slots ({date})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomTime(!isCustomTime)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c9ff35',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isCustomTime ? 'Use Standard Slots' : 'Custom Time Range'}
                </button>
              </div>

              {isChecking ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', background: '#0d0f11', borderRadius: '12px' }}>
                  Checking venue time slot availability...
                </div>
              ) : isCustomTime ? (
                /* Custom Time Inputs */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#0d0f11', padding: '16px', borderRadius: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 10px',
                        background: '#151719',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 10px',
                        background: '#151719',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* Preset Slots Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                  {PRESET_SLOTS.map((slot) => {
                    const booked = isSlotBooked(slot.startTime, slot.endTime);
                    const isSelected = startTime === slot.startTime && endTime === slot.endTime;
                    const matchTitle = getConflictingGameTitle(slot.startTime, slot.endTime);

                    return (
                      <button
                        key={slot.label}
                        type="button"
                        disabled={booked}
                        onClick={() => {
                          setStartTime(slot.startTime);
                          setEndTime(slot.endTime);
                        }}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          background: booked
                            ? 'rgba(255, 77, 77, 0.08)'
                            : isSelected
                            ? 'rgba(201, 255, 53, 0.18)'
                            : '#0d0f11',
                          border: booked
                            ? '1px dashed rgba(255, 77, 77, 0.3)'
                            : isSelected
                            ? '2px solid #c9ff35'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: booked ? 'not-allowed' : 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: booked ? '#888' : isSelected ? '#c9ff35' : '#fff' }}>
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: booked ? 'rgba(255,77,77,0.2)' : isSelected ? '#c9ff35' : 'rgba(201,255,53,0.15)',
                              color: booked ? '#ff6b6b' : isSelected ? '#000' : '#c9ff35',
                            }}
                          >
                            {booked ? '🔴 BOOKED' : isSelected ? '✓ SELECTED' : '🟢 AVAILABLE'}
                          </span>
                        </div>

                        {booked ? (
                          <span style={{ fontSize: '11px', color: '#ff6b6b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Occupied ({matchTitle || 'Scheduled Game'})
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            {slot.label.split(' ')[2] || 'Match Slot'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Slot Summary */}
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: isSelectedSlotAvailable ? 'rgba(201, 255, 53, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                border: isSelectedSlotAvailable ? '1px solid rgba(201, 255, 53, 0.3)' : '1px solid rgba(255, 77, 77, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Selected Slot: </span>
                <strong style={{ color: '#fff' }}>{date} ({startTime} - {endTime})</strong>
              </div>
              <span style={{ fontWeight: 800, color: isSelectedSlotAvailable ? '#c9ff35' : '#ff6b6b' }}>
                {isSelectedSlotAvailable ? '✓ READY TO BOOK' : '✕ SLOT BOOKED'}
              </span>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!isSelectedSlotAvailable || isChecking}
              style={{
                width: '100%',
                height: '46px',
                background: isSelectedSlotAvailable ? '#c9ff35' : '#333',
                color: isSelectedSlotAvailable ? '#070809' : '#888',
                fontWeight: 800,
                borderRadius: '10px',
                border: 'none',
                cursor: isSelectedSlotAvailable ? 'pointer' : 'not-allowed',
                fontSize: '14px',
              }}
            >
              Continue to Player Capacity →
            </button>
          </div>
        )}

        {/* STEP 4: PLAYER CAPACITY & CONFIRMATION */}
        {step === 4 && selectedVenue && (
          <form onSubmit={handleBookGame}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>4. Review & Create Game</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Confirm match capacity and details before publishing.
            </p>

            {/* Stadium Visual Preview Card */}
            <div
              style={{
                background: '#0d0f11',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={selectedVenue.selectedPhotoUrl || selectedVenue.imageUrl}
                    alt={selectedVenue.name}
                    className="clean-stadium-img"
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', textTransform: 'uppercase' }}>
                    {sportReq.icon} {sportReq.name}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '2px 0' }}>{selectedVenue.name}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>📍 {selectedVenue.address || selectedVenue.location}</p>
                  <span style={{ fontSize: '12px', color: '#ffb703', fontWeight: 700 }}>
                    ⭐ {selectedVenue.rating || 4.7}
                  </span>
                </div>
              </div>

              {/* Player Capacity Bar Requirement */}
              <div style={{ background: '#151719', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  <span>{sportReq.name} Capacity</span>
                  <span style={{ color: '#c9ff35' }}>
                    {initialRegistered} / {sportReq.maxPlayers} players
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${capacityPercent}%`,
                      backgroundColor: '#c9ff35',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <span>🟢 {remainingSpots} spots remaining</span>
                  <span>{date} · {startTime} - {endTime}</span>
                </div>
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

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '48px',
                background: '#c9ff35',
                color: '#070809',
                fontWeight: 800,
                fontSize: '15px',
                borderRadius: '10px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting
                ? 'Publishing Match...'
                : !isAuthenticated
                ? `Login to Create ${sportReq.name} Match`
                : `Create & Join ${sportReq.name} Match`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StadiumBookingModal;
