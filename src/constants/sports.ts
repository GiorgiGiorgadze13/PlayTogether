export interface SportRequirement {
  id: string;
  name: string;
  maxPlayers: number;
  defaultSearchQuery: string;
  icon: string;
  imageUrl: string;
  description: string;
}

export const SPORT_REQUIREMENTS: Record<string, SportRequirement> = {
  football: {
    id: 'football',
    name: 'Football',
    maxPlayers: 22,
    defaultSearchQuery: 'football stadium field',
    icon: '⚽',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    description: '7v7 & 11v11 Full Turf Pitches & Floodlit Arenas',
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    maxPlayers: 2,
    defaultSearchQuery: 'tennis court',
    icon: '🎾',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
    description: 'Singles & Doubles Clay & Hard Courts',
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    maxPlayers: 10,
    defaultSearchQuery: 'basketball court arena',
    icon: '🏀',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    description: '3v3 & 5v5 Professional Hardwood Courts',
  },
  volleyball: {
    id: 'volleyball',
    name: 'Volleyball',
    maxPlayers: 12,
    defaultSearchQuery: 'volleyball court arena',
    icon: '🏐',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
    description: 'Indoor Hardwood & Beach Volleyball Arenas',
  },
  tableTennis: {
    id: 'tableTennis',
    name: 'Table Tennis',
    maxPlayers: 2,
    defaultSearchQuery: 'table tennis club',
    icon: '🏓',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
    description: 'Fast-paced Indoor Ping Pong Clubs',
  },
  rugby: {
    id: 'rugby',
    name: 'Rugby',
    maxPlayers: 30,
    defaultSearchQuery: 'rugby pitch stadium',
    icon: '🏉',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    description: 'Full Contact & Rugby Sevens Stadiums',
  },
  boxing: {
    id: 'boxing',
    name: 'Boxing',
    maxPlayers: 2,
    defaultSearchQuery: 'boxing ring gym arena',
    icon: '🥊',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
    description: 'Boxing Rings & Professional Sparring Gyms',
  },
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    maxPlayers: 2,
    defaultSearchQuery: 'badminton court hall',
    icon: '🏸',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    description: 'Indoor Wooden & Synthetic Court Halls',
  },
  futsal: {
    id: 'futsal',
    name: 'Futsal',
    maxPlayers: 10,
    defaultSearchQuery: 'futsal court arena',
    icon: '⚽',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
    description: '5v5 Indoor Hard Surface Futsal Courts',
  },
  handball: {
    id: 'handball',
    name: 'Handball',
    maxPlayers: 14,
    defaultSearchQuery: 'handball arena court',
    icon: '🤾',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    description: 'Indoor Team Handball Complexes',
  },
  baseball: {
    id: 'baseball',
    name: 'Baseball',
    maxPlayers: 18,
    defaultSearchQuery: 'baseball field stadium',
    icon: '⚾',
    imageUrl: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=800&q=80',
    description: 'Baseball Diamonds & Practice Cages',
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
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      description: 'Sports Matches & Games',
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
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    description: `${sportName} Matches & Booking`,
  };
}
