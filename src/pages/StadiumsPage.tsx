import React from 'react';
import type { TranslationContent } from '../types/translations';
import { StadiumsSection } from '../Components/StadiumsSection';
import { useLanguage } from '../context/LanguageContext';

interface StadiumsPageProps {
  c: TranslationContent;
}

export const StadiumsPage: React.FC<StadiumsPageProps> = ({ c }) => {
  const { lang } = useLanguage();
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <StadiumsSection c={c} lang={lang} />
    </div>
  );
};

export default StadiumsPage;
