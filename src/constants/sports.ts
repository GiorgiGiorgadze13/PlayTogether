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

export function getFallbackVenuesForSport(sportName: string, query: string = '') {
  const normSport = (sportName || '').toLowerCase();
  const normQuery = (query || '').toLowerCase();

  const ALL_SPORT_VENUES: Record<string, Array<{
    id: string;
    name: string;
    address: string;
    location: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    selectedPhotoUrl: string;
    rating: number;
    placeId: string;
    sport: string;
    price: number;
  }>> = {
    tennis: [
      {
        id: 'venue-tennis-1',
        name: 'Leila Meskhi Tennis Academy & Club',
        address: '18 Marjanishvili St, Tbilisi',
        location: 'Tbilisi, Marjanishvili',
        latitude: 41.7088,
        longitude: 44.7955,
        imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        placeId: 'tennis-1',
        sport: 'Tennis',
        price: 70,
      },
      {
        id: 'venue-tennis-2',
        name: 'Mziuri Park Tennis Courts',
        address: 'Mziuri Park, Vake, Tbilisi',
        location: 'Tbilisi, Mziuri',
        latitude: 41.7103,
        longitude: 44.7731,
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        placeId: 'tennis-2',
        sport: 'Tennis',
        price: 60,
      },
      {
        id: 'venue-tennis-3',
        name: 'Nutsubidze Tennis Complex',
        address: 'Nutsubidze Plateau, Tbilisi',
        location: 'Tbilisi, Saburtalo',
        latitude: 41.7299,
        longitude: 44.7310,
        imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        placeId: 'tennis-3',
        sport: 'Tennis',
        price: 50,
      },
    ],
    football: [
      {
        id: 'stadium-155',
        name: 'ლისი აბანოს სტადიონი',
        address: 'ლისის ტბის მიმდებარედ, თბილისი',
        location: 'თბილისი, საბურთალო',
        latitude: 41.7408,
        longitude: 44.7398,
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        placeId: 'football-1',
        sport: 'Football',
        price: 110,
      },
      {
        id: 'stadium-180',
        name: 'ინტერ აკადემიის მოედანი №3',
        address: 'დიღმის მასივი, თბილისი',
        location: 'თბილისი, დიღომი',
        latitude: 41.7814,
        longitude: 44.7759,
        imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        placeId: 'football-2',
        sport: 'Football',
        price: 180,
      },
      {
        id: 'stadium-181',
        name: 'მესხის სახელობის სტადიონის დამხმარე მოედანი',
        address: '74 Chavchavadze Ave, Tbilisi',
        location: 'Tbilisi, Vake',
        latitude: 41.7231,
        longitude: 44.7897,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        placeId: 'football-3',
        sport: 'Football',
        price: 150,
      },
      {
        id: 'stadium-185',
        name: 'მარაკანას მოედანი',
        address: 'საბურთალო, თბილისი',
        location: 'თბილისი, საბურთალო',
        latitude: 41.7213,
        longitude: 44.7202,
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        rating: 5.0,
        placeId: 'football-4',
        sport: 'Football',
        price: 200,
      },
    ],
    basketball: [
      {
        id: 'stadium-214',
        name: 'ზაზა ფაჩულიას დარბაზი A',
        address: 'დიდუბე, თბილისი',
        location: 'თბილისი, დიდუბე',
        latitude: 41.7423,
        longitude: 44.7803,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
        rating: 5.0,
        placeId: 'basket-1',
        sport: 'Basketball',
        price: 220,
      },
      {
        id: 'stadium-197',
        name: 'Brooklyn Basketball Academy',
        address: '37 Chavchavadze Ave, Tbilisi',
        location: 'Tbilisi, Vake',
        latitude: 41.7081,
        longitude: 44.7689,
        imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        placeId: 'basket-2',
        sport: 'Basketball',
        price: 125,
      },
      {
        id: 'venue-basket-3',
        name: 'Tbilisi Olympic Palace Court',
        address: 'University St 6, Tbilisi',
        location: 'Tbilisi, Saburtalo',
        latitude: 41.7198,
        longitude: 44.7405,
        imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        placeId: 'basket-3',
        sport: 'Basketball',
        price: 150,
      },
    ],
    volleyball: [
      {
        id: 'venue-volley-1',
        name: 'New Volleyball Arena Digomi',
        address: 'Digomi Olympic Complex, Tbilisi',
        location: 'Tbilisi, Digomi',
        latitude: 41.7654,
        longitude: 44.7699,
        imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        placeId: 'volley-1',
        sport: 'Volleyball',
        price: 140,
      },
      {
        id: 'venue-volley-2',
        name: 'Vake Beach & Indoor Volleyball Court',
        address: 'Vake Park, Tbilisi',
        location: 'Tbilisi, Vake',
        latitude: 41.7095,
        longitude: 44.7562,
        imageUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        placeId: 'volley-2',
        sport: 'Volleyball',
        price: 100,
      },
    ],
    tabletennis: [
      {
        id: 'venue-tt-1',
        name: 'Tbilisi Table Tennis Club',
        address: '14 Vera Park, Tbilisi',
        location: 'Tbilisi, Vera',
        latitude: 41.7052,
        longitude: 44.7891,
        imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        placeId: 'tt-1',
        sport: 'Table Tennis',
        price: 40,
      },
      {
        id: 'venue-tt-2',
        name: 'Saburtalo Ping Pong Masters Center',
        address: 'Pekini Ave 22, Tbilisi',
        location: 'Tbilisi, Saburtalo',
        latitude: 41.7215,
        longitude: 44.7682,
        imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1000&q=80',
        rating: 4.5,
        placeId: 'tt-2',
        sport: 'Table Tennis',
        price: 35,
      },
    ],
    boxing: [
      {
        id: 'venue-boxing-1',
        name: 'Champions Boxing Ring & Sparring Gym',
        address: '8 Merab Kostava St, Tbilisi',
        location: 'Tbilisi, Vera',
        latitude: 41.7032,
        longitude: 44.7885,
        imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        placeId: 'boxing-1',
        sport: 'Boxing',
        price: 80,
      },
      {
        id: 'venue-boxing-2',
        name: 'Tbilisi Heavyweight Boxing Center',
        address: 'Vazha-Pshavela Ave 45, Tbilisi',
        location: 'Tbilisi, Saburtalo',
        latitude: 41.7255,
        longitude: 44.7412,
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        placeId: 'boxing-2',
        sport: 'Boxing',
        price: 90,
      },
    ],
    badminton: [
      {
        id: 'venue-badmin-1',
        name: 'Central Badminton Complex',
        address: '12 Navtlughi St, Tbilisi',
        location: 'Tbilisi, Isani',
        latitude: 41.6891,
        longitude: 44.8399,
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        placeId: 'badmin-1',
        sport: 'Badminton',
        price: 60,
      },
      {
        id: 'venue-badmin-2',
        name: 'Olympic Badminton Indoor Hall',
        address: 'Digomi Olympic Complex, Tbilisi',
        location: 'Tbilisi, Digomi',
        latitude: 41.7654,
        longitude: 44.7699,
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        placeId: 'badmin-2',
        sport: 'Badminton',
        price: 55,
      },
    ],
    rugby: [
      {
        id: 'venue-rugby-1',
        name: 'Shevardeni Rugby Stadium',
        address: 'Bagebi Complex, Tbilisi',
        location: 'Tbilisi, Bagebi',
        latitude: 41.7012,
        longitude: 44.7321,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
        selectedPhotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        placeId: 'rugby-1',
        sport: 'Rugby',
        price: 160,
      },
    ],
  };

  const keyClean = normSport.replace(/[\s\-_]+/g, '');
  const list = ALL_SPORT_VENUES[keyClean] || ALL_SPORT_VENUES['football'];

  if (normQuery) {
    const filtered = list.filter(v => v.name.toLowerCase().includes(normQuery) || v.address.toLowerCase().includes(normQuery));
    if (filtered.length > 0) return filtered;
  }

  return list;
}
