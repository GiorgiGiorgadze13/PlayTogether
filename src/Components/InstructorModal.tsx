import React, { useState } from 'react';
import type { LearnSport, InstructorProfile } from '../constants/instructors';
import type { TranslationContent } from '../types/translations';
import { api } from '../services/api';
import { ApiError } from '../services/api';

interface InstructorModalProps {
  sport: LearnSport;
  onClose: () => void;
  c: TranslationContent;
  isAuthenticated: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
}

export const InstructorModal: React.FC<InstructorModalProps> = ({ sport, onClose, c, isAuthenticated, openAuthModal }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorProfile | null>(null);
  const [lessonType, setLessonType] = useState<'1-on-1' | 'Group Coaching'>('1-on-1');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  const handleStartBooking = (instructor: InstructorProfile) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedInstructor(instructor);
    setSelectedSlot(instructor.availableSlots[0] || '');
    setBookingConfirmed(false);
    setBookingError(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedInstructor || !selectedSlot) return;
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setIsLoading(true);
    setBookingError(null);
    try {
      const rate = lessonType === '1-on-1'
        ? selectedInstructor.hourlyRate1on1
        : selectedInstructor.hourlyRateGroup;

      await api.createInstructorBooking({
        instructorId: selectedInstructor.id,
        instructorName: selectedInstructor.name,
        sport: sport.name,
        lessonType,
        slot: selectedSlot,
        amount: rate,
      });
      setBookingConfirmed(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setBookingError(error.message);
      } else {
        setBookingError('Failed to create booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(7, 8, 9, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 3vw, 20px)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '92vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
          padding: 'clamp(16px, 4vw, 32px)',
          color: '#ffffff',
          position: 'relative',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', paddingRight: '40px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              borderRadius: '14px',
              background: 'rgba(201, 255, 53, 0.12)',
              border: '1px solid rgba(201, 255, 53, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}
          >
            {sport.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#c9ff35', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {c.officialInstructors}
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, margin: '2px 0 0', color: '#fff', lineHeight: 1.2 }}>
              {sport.name} {c.coachingAcademy}
            </h2>
          </div>
        </div>

        {/* Login Prompt */}
        {showLoginPrompt ? (
          <div
            style={{
              background: 'rgba(201, 255, 53, 0.06)',
              border: '1px solid rgba(201, 255, 53, 0.25)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Sign In to Book a Lesson
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', maxWidth: '420px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              You need to be logged in to book an instructor lesson. Create a free account or sign in to continue.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { openAuthModal('login'); onClose(); }}
                style={{
                  background: '#c9ff35',
                  color: '#070809',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { openAuthModal('register'); onClose(); }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Create Account
              </button>
            </div>
            <button
              onClick={() => setShowLoginPrompt(false)}
              style={{ marginTop: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer' }}
            >
              ← Back to Instructors
            </button>
          </div>
        ) : selectedInstructor ? (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedInstructor(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#c9ff35',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              ← {c.backToInstructors} {sport.name}
            </button>

            {bookingConfirmed ? (
              <div
                style={{
                  background: 'rgba(201, 255, 53, 0.08)',
                  border: '1px solid rgba(201, 255, 53, 0.3)',
                  borderRadius: '20px',
                  padding: '40px 30px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#c9ff35', marginBottom: '8px' }}>
                  {c.lessonBookingConfirmed}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 24px' }}>
                  {c.lessonBookingConfirmedDesc} <strong>{lessonType}</strong> {c.learnEyebrow.includes('INSTRUCTOR') ? 'lesson for' : 'გაკვეთილი'} <strong>{sport.name}</strong> with <strong>{selectedInstructor.name}</strong>.
                </p>

                <div
                  style={{
                    background: '#0d0f11',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    maxWidth: '400px',
                    margin: '0 auto 28px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{c.selectSlot.toUpperCase()}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>📅 {selectedSlot}</div>

                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{c.location.toUpperCase()}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>📍 {selectedInstructor.location}</div>

                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{c.checkoutTotal.toUpperCase()}</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#c9ff35' }}>
                    ₾{lessonType === '1-on-1' ? selectedInstructor.hourlyRate1on1 : selectedInstructor.hourlyRateGroup}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {c.done}
                </button>
              </div>
            ) : (
              <div>
                {/* Instructor Profile Header */}
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    background: '#0d0f11',
                    padding: '20px',
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '24px',
                  }}
                >
                  <img
                    src={selectedInstructor.avatarUrl}
                    alt={selectedInstructor.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #c9ff35' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                      {selectedInstructor.name}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#c9ff35', fontWeight: 700, marginBottom: '6px' }}>
                      {selectedInstructor.title}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      <span>⭐ <strong>{selectedInstructor.rating}</strong> ({selectedInstructor.reviewCount} {c.reviewsLabel})</span>
                      <span>•</span>
                      <span>🏅 <strong>{selectedInstructor.experienceYears} {c.yearsExperience}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Lesson Format Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                    {c.selectLessonType}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div
                      onClick={() => setLessonType('1-on-1')}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: lessonType === '1-on-1' ? 'rgba(201, 255, 53, 0.12)' : '#0d0f11',
                        border: `1px solid ${lessonType === '1-on-1' ? '#c9ff35' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 800, color: lessonType === '1-on-1' ? '#c9ff35' : '#fff' }}>
                        👤 {c.individualLesson}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                        {c.personalizedFocus}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#c9ff35', marginTop: '8px' }}>
                        ₾{selectedInstructor.hourlyRate1on1} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>/ hr</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setLessonType('Group Coaching')}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: lessonType === 'Group Coaching' ? 'rgba(201, 255, 53, 0.12)' : '#0d0f11',
                        border: `1px solid ${lessonType === 'Group Coaching' ? '#c9ff35' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 800, color: lessonType === 'Group Coaching' ? '#c9ff35' : '#fff' }}>
                        👥 {c.groupLesson}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                        {c.trainAlongside}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#c9ff35', marginTop: '8px' }}>
                        ₾{selectedInstructor.hourlyRateGroup} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>/ hr</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot Selector */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                    {c.availableTimeSlots}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedInstructor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '10px',
                          background: selectedSlot === slot ? '#c9ff35' : '#0d0f11',
                          color: selectedSlot === slot ? '#070809' : '#fff',
                          border: `1px solid ${selectedSlot === slot ? '#c9ff35' : 'rgba(255,255,255,0.15)'}`,
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        🕒 {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {bookingError && (
                  <div style={{
                    background: 'rgba(239,83,80,0.1)',
                    border: '1px solid rgba(239,83,80,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    color: '#ef5350',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    ❌ {bookingError}
                  </div>
                )}

                {/* Confirm Booking Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSlot || isLoading}
                  style={{
                    width: '100%',
                    height: '50px',
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: (selectedSlot && !isLoading) ? 'pointer' : 'not-allowed',
                    opacity: (selectedSlot && !isLoading) ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #07080966', borderTopColor: '#070809', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Confirming…
                    </>
                  ) : (
                    <>{c.confirmBookingWith} {selectedInstructor.name} →</>
                  )}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* List of Available Instructors for this Sport */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sport.instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  style={{
                    background: '#0d0f11',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '18px',
                    padding: 'clamp(14px, 3vw, 24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Top Row: Avatar + Main Details */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Avatar & Rating */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <img
                        src={instructor.avatarUrl}
                        alt={instructor.name}
                        style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201, 255, 53, 0.4)', marginBottom: '6px', display: 'block' }}
                      />
                      <div
                        style={{
                          background: 'rgba(201, 255, 53, 0.12)',
                          color: '#c9ff35',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 900,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ⭐ {instructor.rating} ({instructor.reviewCount})
                      </div>
                    </div>

                    {/* Main Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 800, margin: '0 0 3px', color: '#fff' }}>
                        {instructor.name}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#c9ff35', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                        {instructor.title}
                      </div>

                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 10px', lineHeight: 1.5 }}>
                        {instructor.bio}
                      </p>

                      {/* Qualifications badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                        {instructor.qualifications.map((q) => (
                          <span
                            key={q}
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              color: 'rgba(255,255,255,0.8)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              fontWeight: 700,
                            }}
                          >
                            🎖️ {q}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                        📍 {instructor.location} • 🏆 {instructor.experienceYears} {c.yearsExperience}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Pricing & Booking CTA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      paddingTop: '14px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                        {c.oneOnOneLesson}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#c9ff35' }}>
                        ₾{instructor.hourlyRate1on1} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/ hr</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                        {c.groupPriceLabel}: ₾{instructor.hourlyRateGroup} {c.perHourShort}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartBooking(instructor)}
                      style={{
                        background: '#c9ff35',
                        color: '#070809',
                        border: 'none',
                        padding: '11px 20px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      {isAuthenticated ? `${c.bookLesson} →` : '🔒 Sign In to Book'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
