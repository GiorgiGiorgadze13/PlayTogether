import React from 'react';
import type { TranslationContent } from '../types/translations';
import { Hero } from '../Components/Hero';
import { SportsSection } from '../Components/SportsSection';
import { InstructorsSection } from '../Components/InstructorsSection';
import { GamesSection } from '../Components/GamesSection';

interface HomePageProps {
  c: TranslationContent;
}

export const HomePage: React.FC<HomePageProps> = ({ c }) => {
  return (
    <div>
      <Hero c={c} />
      <SportsSection c={c} />
      <InstructorsSection c={c} />
      <GamesSection c={c} />
    </div>
  );
};

export default HomePage;
