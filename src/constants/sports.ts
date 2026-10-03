export interface SportRequirement {
  id: string;
  name: string;
  maxPlayers: number;
  defaultSearchQuery: string;
  icon: string;
}

export const SPORT_REQUIREMENTS: Record<string, SportRequirement> = {
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    maxPlayers: 2,
    defaultSearchQuery: 'tennis court',
    icon: '🎾',
  },
  football: {
    id: 'football',
    name: 'Football',
    maxPlayers: 22,
    defaultSearchQuery: 'football stadium field',
    icon: '⚽',
  },
  soccer: {
    id: 'soccer',
    name: 'Soccer',
    maxPlayers: 22,
    defaultSearchQuery: 'soccer pitch field',
    icon: '⚽',
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    maxPlayers: 10,
    defaultSearchQuery: 'basketball court arena',
    icon: '🏀',
  },
  volleyball: {
    id: 'volleyball',
    name: 'Volleyball',
    maxPlayers: 12,
    defaultSearchQuery: 'volleyball court arena',
    icon: '🏐',
  },
  rugby: {
    id: 'rugby',
    name: 'Rugby',
    maxPlayers: 30,
    defaultSearchQuery: 'rugby pitch stadium',
    icon: '🏉',
  },
  futsal: {
    id: 'futsal',
    name: 'Futsal',
    maxPlayers: 10,
    defaultSearchQuery: 'futsal court arena',
    icon: '⚽',
  },
  handball: {
    id: 'handball',
    name: 'Handball',
    maxPlayers: 14,
    defaultSearchQuery: 'handball arena court',
    icon: '🤾',
  },
  baseball: {
    id: 'baseball',
    name: 'Baseball',
    maxPlayers: 18,
    defaultSearchQuery: 'baseball field stadium',
    icon: '⚾',
  },
  tableTennis: {
    id: 'tableTennis',
    name: 'Table Tennis',
    maxPlayers: 2,
    defaultSearchQuery: 'table tennis club',
    icon: '🏓',
  },
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    maxPlayers: 2,
    defaultSearchQuery: 'badminton court hall',
    icon: '🏸',
  },
};

export function getSportRequirements(sportName: string): SportRequirement {
  if (!sportName) {
    return {
      id: 'custom',
      name: 'Sports Match',
      maxPlayers: 10,
      defaultSearchQuery: 'sports arena venue',
      icon: '🏆',
    };
  }

  const clean = sportName.toLowerCase().replace(/[\s\-_]+/g, '');

  for (const key of Object.keys(SPORT_REQUIREMENTS)) {
    const keyClean = key.toLowerCase().replace(/[\s\-_]+/g, '');
    const nameClean = SPORT_REQUIREMENTS[key].name.toLowerCase().replace(/[\s\-_]+/g, '');
    if (keyClean === clean || nameClean === clean) {
      return SPORT_REQUIREMENTS[key];
    }
  }

  return {
    id: sportName.toLowerCase().replace(/\s+/g, '-'),
    name: sportName,
    maxPlayers: 10,
    defaultSearchQuery: `${sportName} venue stadium`,
    icon: '🏆',
  };
}
