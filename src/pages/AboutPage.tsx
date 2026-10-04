import React from 'react';
import type { TranslationContent } from '../types/translations';
import { AboutFeaturesSection } from '../Components/AboutFeaturesSection';

interface AboutPageProps {
  c: TranslationContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ c }) => {
  return (
    <div style={{ paddingTop: '40px', minHeight: '80vh' }}>
      <AboutFeaturesSection c={c} />
    </div>
  );
};

export default AboutPage;
