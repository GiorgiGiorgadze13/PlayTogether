import React from 'react';
import type { TranslationContent } from '../types/translations';
import { Hero } from '../Components/Hero';

interface HomePageProps {
  c: TranslationContent;
}

export const HomePage: React.FC<HomePageProps> = ({ c }) => {
  return (
    <div>
      <Hero c={c} />
    </div>
  );
};

export default HomePage;
