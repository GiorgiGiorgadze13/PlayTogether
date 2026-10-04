import React from 'react';
import type { TranslationContent } from '../types/translations';
import { StadiumsSection } from '../Components/StadiumsSection';

interface StadiumsPageProps {
  c: TranslationContent;
}

export const StadiumsPage: React.FC<StadiumsPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <StadiumsSection c={c} />
    </div>
  );
};

export default StadiumsPage;
