import React from 'react';
import type { TranslationContent } from '../types/translations';
import { HowItWorksSection } from '../Components/HowItWorksSection';

interface AboutPageProps {
  c: TranslationContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <HowItWorksSection c={c} />
    </div>
  );
};

export default AboutPage;
