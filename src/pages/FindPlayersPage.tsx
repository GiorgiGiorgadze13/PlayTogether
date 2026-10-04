import React from 'react';
import type { TranslationContent } from '../types/translations';
import { FindPlayersSection } from '../Components/FindPlayersSection';

interface FindPlayersPageProps {
  c: TranslationContent;
}

export const FindPlayersPage: React.FC<FindPlayersPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '20px', minHeight: '80vh' }}>
      <FindPlayersSection c={c} />
    </div>
  );
};

export default FindPlayersPage;
