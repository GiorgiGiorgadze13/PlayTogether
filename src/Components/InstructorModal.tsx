import React, { useState } from 'react';
import type { LearnSport, InstructorProfile } from '../constants/instructors';
import type { TranslationContent } from '../types/translations';

interface InstructorModalProps {
  sport: LearnSport;
  onClose: () => void;
  c: TranslationContent;
}

export const InstructorModal: React.FC<InstructorModalProps> = ({ sport, onClose, c }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorProfile | null>(null);
  const [lessonType, setLessonType] = useState<'1-on-1' | 'Group Coaching'>('1-on-1');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const handleStartBooking = (instructor: InstructorProfile) => {
    setSelectedInstructor(instructor);
    setSelectedSlot(instructor.availableSlots[0] || '');
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
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
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
          padding: '32px',
          color: '#ffffff',
          position: 'relative',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(201, 255, 53, 0.12)',
              border: '1px solid rgba(201, 255, 53, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            {sport.icon}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              OFFICIAL INSTRUCTORS & COACHES
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '2px 0 0', color: '#fff' }}>
              {sport.name} Coaching Academy
            </h2>
          </div>
        </div>

        {/* Active Booking Flow vs Instructor Selection List */}
        {selectedInstructor ? (
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
              ← Back to all {sport.name} instructors
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
                  Lesson Booking Confirmed!
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 24px' }}>
                  You have successfully booked a <strong>{lessonType}</strong> lesson for <strong>{sport.name}</strong> with <strong>{selectedInstructor.name}</strong>.
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
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>TIME SLOT</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>📅 {selectedSlot}</div>

                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>LOCATION</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>📍 {selectedInstructor.location}</div>

                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>TOTAL PRICE</div>
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
                  Done
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
                      <span>⭐ <strong>{selectedInstructor.rating}</strong> ({selectedInstructor.reviewCount} reviews)</span>
                      <span>•</span>
                      <span>🏅 <strong>{selectedInstructor.experienceYears} Years</strong> {c.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Lesson Format Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                    SELECT LESSON TYPE
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
                        Personalized focus & rapid skill progress
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
                        Train alongside motivated peers
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
                    AVAILABLE TIME SLOTS
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

                {/* Confirm Booking Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSlot}
                  style={{
                    width: '100%',
                    height: '50px',
                    background: '#c9ff35',
                    color: '#070809',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: selectedSlot ? 'pointer' : 'not-allowed',
                    opacity: selectedSlot ? 1 : 0.5,
                  }}
                >
                  Confirm Booking with {selectedInstructor.name} →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* List of Available Instructors for this Sport */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sport.instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  style={{
                    background: '#0d0f11',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '24px',
                    alignItems: 'center',
                  }}
                >
                  {/* Avatar & Rating */}
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={instructor.avatarUrl}
                      alt={instructor.name}
                      style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201, 255, 53, 0.4)', marginBottom: '8px' }}
                    />
                    <div
                      style={{
                        background: 'rgba(201, 255, 53, 0.12)',
                        color: '#c9ff35',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 900,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ⭐ {instructor.rating} ({instructor.reviewCount})
                    </div>
                  </div>

                  {/* Main Details */}
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                      {instructor.name}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#c9ff35', fontWeight: 700, marginBottom: '10px' }}>
                      {instructor.title}
                    </div>

                    <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 12px', lineHeight: 1.45 }}>
                      {instructor.bio}
                    </p>

                    {/* Qualifications badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {instructor.qualifications.map((q) => (
                        <span
                          key={q}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.8)',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          🎖️ {q}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                      📍 {instructor.location} • 🏆 {instructor.experienceYears} Years Experience
                    </div>
                  </div>

                  {/* Pricing & Booking CTA */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      borderLeft: '1px solid rgba(255,255,255,0.08)',
                      paddingLeft: '24px',
                      height: '100%',
                      minWidth: '160px',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      1-ON-1 LESSON
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#c9ff35', margin: '2px 0 10px' }}>
                      ₾{instructor.hourlyRate1on1} <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/ hr</span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                      Group: ₾{instructor.hourlyRateGroup} / hr
                    </div>

                    <button
                      onClick={() => handleStartBooking(instructor)}
                      style={{
                        background: '#c9ff35',
                        color: '#070809',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      Book Lesson →
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
