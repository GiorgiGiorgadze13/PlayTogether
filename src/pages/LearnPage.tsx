import React from 'react';
import type { TranslationContent } from '../types/translations';
import { InstructorsSection } from '../Components/InstructorsSection';

interface LearnPageProps {
  c: TranslationContent;
}

export const LearnPage: React.FC<LearnPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '20px', minHeight: '80vh' }}>
      <InstructorsSection c={c} />
    </div>
  );
};

export default LearnPage;
