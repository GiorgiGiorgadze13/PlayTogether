import React from 'react';
import type { TranslationContent } from '../types/translations';
import { SearchSection } from '../Components/SearchSection';
import { GamesSection } from '../Components/GamesSection';

interface GamesPageProps {
  c: TranslationContent;
}

export const GamesPage: React.FC<GamesPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <SearchSection c={c} />
      <GamesSection c={c} />
    </div>
  );
};

export default GamesPage;
