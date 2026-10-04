import React from 'react';
import type { TranslationContent } from '../types/translations';
import { Hero } from '../Components/Hero';
import { SportsSection } from '../Components/SportsSection';
import { StadiumsSection } from '../Components/StadiumsSection';
import { GamesSection } from '../Components/GamesSection';
import { TournamentsSection } from '../Components/TournamentsSection';

interface HomePageProps {
  c: TranslationContent;
}

export const HomePage: React.FC<HomePageProps> = ({ c }) => {
  return (
    <div>
      <Hero c={c} />
      <SportsSection c={c} />
      <StadiumsSection c={c} />
      <GamesSection c={c} />
      <TournamentsSection c={c} />
    </div>
  );
};

export default HomePage;
