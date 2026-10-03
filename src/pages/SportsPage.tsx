import React from 'react';
import type { TranslationContent } from '../types/translations';
import { SportsSection } from '../Components/SportsSection';

interface SportsPageProps {
  c: TranslationContent;
}

export const SportsPage: React.FC<SportsPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <SportsSection c={c} />
    </div>
  );
};

export default SportsPage;
