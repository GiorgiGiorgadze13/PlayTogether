import React from 'react';
import type { TranslationContent } from '../types/translations';
import { TournamentsSection } from '../Components/TournamentsSection';

interface TournamentsPageProps {
  c: TranslationContent;
}

export const TournamentsPage: React.FC<TournamentsPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <TournamentsSection c={c} />
    </div>
  );
};

export default TournamentsPage;
