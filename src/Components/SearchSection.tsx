import React from 'react';
import type { TranslationContent } from '../types/translations';

interface SearchSectionProps {
  c: TranslationContent;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ c }) => {
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

        <div className="search-box">
          <div className="search-field">
            <small>SPORT</small>
            <div className="field-value"><span className="field-icon">●</span> Football</div>
          </div>
          <div className="search-field">
            <small>LOCATION</small>
            <div className="field-value"><span className="field-icon">⌖</span> Tbilisi</div>
          </div>
          <div className="search-field">
            <small>DATE</small>
            <div className="field-value"><span className="field-icon">□</span> Choose date</div>
          </div>
          <div className="search-field">
            <small>TIME</small>
            <div className="field-value"><span className="field-icon">◷</span> Any time</div>
          </div>
          <button className="search-button">
            {c.searchBtn} <span>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
