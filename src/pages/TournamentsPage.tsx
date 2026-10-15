import React from 'react';
import type { TranslationContent } from '../types/translations';
import { TournamentsSection } from '../Components/TournamentsSection';
import { useLanguage } from '../context/LanguageContext';

interface TournamentsPageProps {
  c: TranslationContent;
}

export const TournamentsPage: React.FC<TournamentsPageProps> = ({ c }) => {
  const { lang } = useLanguage();
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <TournamentsSection c={c} lang={lang} />
    </div>
  );
};

export default TournamentsPage;
