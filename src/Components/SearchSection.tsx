import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';

interface SearchSectionProps {
  c: TranslationContent;
  onSearchFilter?: (filters: { sport: string; location: string; date: string; time: string }) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ c, onSearchFilter }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get today's YYYY-MM-DD string
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // State management for interactive selection
  const [sport, setSport] = useState<string>(searchParams.get('sport') || 'Football');
  const [location, setLocation] = useState<string>(searchParams.get('location') || 'All Locations (Tbilisi)');
  const [date, setDate] = useState<string>(searchParams.get('date') || getTodayStr());
  const [time, setTime] = useState<string>(searchParams.get('time') || 'Any time');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filters = { sport, location, date, time };

    if (onSearchFilter) {
      onSearchFilter(filters);
    }

    // Build URL query params
    const queryParams = new URLSearchParams();
    if (sport && sport !== 'All Sports') queryParams.append('sport', sport);
    if (location && !location.startsWith('All Locations')) queryParams.append('location', location);
    if (date) queryParams.append('date', date);
    if (time && time !== 'Any time') queryParams.append('time', time);

    const queryString = queryParams.toString();
    navigate(`/games${queryString ? `?${queryString}` : ''}#games`);

    // Smooth scroll down to games section if present on page
    setTimeout(() => {
      const el = document.getElementById('games');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="search-section" id="search">
      <div className="search-container-card">
        <div className="search-intro">
          <div>
            <span>{c.searchEyebrow}</span>
            <h2>{c.searchTitle}</h2>
          </div>
          <p>{c.searchSubtitle}</p>
        </div>

        <form onSubmit={handleSearch} className="search-box">
          {/* SPORT SELECTOR */}
          <div className="search-field">
            <small>SPORT</small>
            <div className="field-value">
              <span className="field-icon">●</span>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#242624',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <option value="Football">⚽ Football</option>
                <option value="Tennis">🎾 Tennis</option>
                <option value="Basketball">🏀 Basketball</option>
                <option value="Volleyball">🏐 Volleyball</option>
                <option value="Rugby">🏉 Rugby</option>
                <option value="Badminton">🏸 Badminton</option>
                <option value="All Sports">🌟 All Sports</option>
              </select>
            </div>
          </div>

          {/* LOCATION SELECTOR */}
          <div className="search-field">
            <small>LOCATION</small>
            <div className="field-value">
              <span className="field-icon">⌖</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#242624',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <option value="All Locations (Tbilisi)">📍 Tbilisi (All)</option>
                <option value="Tbilisi, Saburtalo">📍 Saburtalo</option>
                <option value="Tbilisi, Vake">📍 Vake</option>
                <option value="Tbilisi, Chugureti">📍 Chugureti</option>
                <option value="Tbilisi, Digomi">📍 Digomi</option>
                <option value="Tbilisi, Marjanishvili">📍 Marjanishvili</option>
                <option value="Tbilisi, Isani">📍 Isani</option>
              </select>
            </div>
          </div>

          {/* DATE PICKER */}
          <div className="search-field">
            <small>DATE</small>
            <div className="field-value">
              <span className="field-icon">📅</span>
              <input
                type="date"
                min={getTodayStr()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#242624',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* TIME SLOT SELECTOR */}
          <div className="search-field">
            <small>TIME</small>
            <div className="field-value">
              <span className="field-icon">⏰</span>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#242624',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <option value="Any time">Any time</option>
                <option value="08:00 - 10:00">08:00 - 10:00 Morning</option>
                <option value="10:00 - 12:00">10:00 - 12:00 Morning</option>
                <option value="12:00 - 14:00">12:00 - 14:00 Afternoon</option>
                <option value="14:00 - 16:00">14:00 - 16:00 Afternoon</option>
                <option value="16:00 - 18:00">16:00 - 18:00 Evening</option>
                <option value="18:00 - 20:00">18:00 - 20:00 Prime Time</option>
                <option value="20:00 - 22:00">20:00 - 22:00 Prime Time</option>
                <option value="22:00 - 24:00">22:00 - 24:00 Late Night</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="search-button">
            {c.searchBtn} <span>↗</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
