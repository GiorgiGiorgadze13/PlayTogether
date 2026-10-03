export interface VenuePlace {
  id: string;
  name: string;
  address: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  selectedPhotoUrl?: string;
  selectedPhotoAttribution?: string;
  rating: number;
  placeId: string;
  sport: string;
  price: number;
}

const REAL_FALLBACK_VENUES: VenuePlace[] = [
  {
    id: 'stadium-football-1',
    name: 'Boris Paichadze Dinamo Arena',
    address: '2 Akaki Tsereteli Ave, Tbilisi, Georgia',
    location: 'Tbilisi, Chugureti',
    latitude: 41.7231,
    longitude: 44.7897,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    placeId: 'ChIJj7939GkUREAR879w_football1',
    sport: 'Football',
    price: 15.0,
  },
  {
    id: 'stadium-football-2',
    name: 'Mikheil Meskhi Stadium',
    address: '74 Chavchavadze Ave, Tbilisi, Georgia',
    location: 'Tbilisi, Vake',
    latitude: 41.7092,
    longitude: 44.7554,
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
    placeId: 'ChIJX99201kUREAR4491_football2',
    sport: 'Football',
    price: 15.0,
  },
  {
    id: 'stadium-football-3',
    name: 'Tbilisi Sports Arena Field',
    address: 'Saburtalo Sports Complex, Tbilisi, Georgia',
    location: 'Tbilisi, Saburtalo',
    latitude: 41.7265,
    longitude: 44.7612,
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    placeId: 'ChIJN15542kUREAR1123_football3',
    sport: 'Football',
    price: 15.0,
  },
  {
    id: 'stadium-tennis-1',
    name: 'Leila Meskhi Tennis Academy & Club',
    address: '18 Marjanishvili St, Tbilisi, Georgia',
    location: 'Tbilisi, Marjanishvili',
    latitude: 41.7088,
    longitude: 44.7955,
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    placeId: 'ChIJW98111kUREAR3322_tennis1',
    sport: 'Tennis',
    price: 30.0,
  },
  {
    id: 'stadium-tennis-2',
    name: 'Mziuri Tennis Courts',
    address: 'Mziuri Park, Vake, Tbilisi, Georgia',
    location: 'Tbilisi, Mziuri',
    latitude: 41.7103,
    longitude: 44.7731,
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1000&q=80',
    rating: 4.5,
    placeId: 'ChIJK00991kUREAR8821_tennis2',
    sport: 'Tennis',
    price: 30.0,
  },
  {
    id: 'stadium-basketball-1',
    name: 'Tbilisi Olympic Palace',
    address: 'University St 6, Tbilisi, Georgia',
    location: 'Tbilisi, Saburtalo',
    latitude: 41.7198,
    longitude: 44.7405,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    placeId: 'ChIJL22331kUREAR4433_basket1',
    sport: 'Basketball',
    price: 10.0,
  },
  {
    id: 'stadium-basketball-2',
    name: 'Vake Sports Hall Basketball Court',
    address: '37 Chavchavadze Ave, Tbilisi, Georgia',
    location: 'Tbilisi, Vake',
    latitude: 41.7081,
    longitude: 44.7689,
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80',
    rating: 4.5,
    placeId: 'ChIJP44551kUREAR6655_basket2',
    sport: 'Basketball',
    price: 10.0,
  },
  {
    id: 'stadium-volleyball-1',
    name: 'New Volleyball Arena Digomi',
    address: 'Digomi Olympic Complex, Tbilisi, Georgia',
    location: 'Tbilisi, Digomi',
    latitude: 41.7654,
    longitude: 44.7699,
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
    placeId: 'ChIJM77881kUREAR9988_volley1',
    sport: 'Volleyball',
    price: 15.0,
  },
  {
    id: 'stadium-rugby-1',
    name: 'Shevardeni Rugby Stadium',
    address: 'Bagebi Complex, Tbilisi, Georgia',
    location: 'Tbilisi, Bagebi',
    latitude: 41.7012,
    longitude: 44.7321,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    placeId: 'ChIJQ11221kUREAR7711_rugby1',
    sport: 'Rugby',
    price: 15.0,
  },
  {
    id: 'stadium-badminton-1',
    name: 'Central Badminton Complex',
    address: '12 Navtlughi St, Tbilisi, Georgia',
    location: 'Tbilisi, Isani',
    latitude: 41.6891,
    longitude: 44.8399,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
    placeId: 'ChIJR33441kUREAR8833_badmin1',
    sport: 'Badminton',
    price: 20.0,
  },
];

export async function searchGooglePlacesVenues(query: string, sport: string): Promise<VenuePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    try {
      const searchTerm = `${sport} ${query || 'stadium court field'} Tbilisi Georgia`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        searchTerm
      )}&key=${apiKey}`;

      const response = await fetch(url);
      const data: any = await response.json();

      if (data && data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
        return data.results.map((place: any, idx: number) => {
          let photoUrl = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80';
          let photoAttr: string | undefined = undefined;

          if (place.photos && place.photos.length > 0) {
            const photoRef = place.photos[0].photo_reference;
            photoUrl = `/api/stadiums/photo?ref=${encodeURIComponent(photoRef)}`;
            if (place.photos[0].html_attributions && place.photos[0].html_attributions.length > 0) {
              photoAttr = place.photos[0].html_attributions[0];
            }
          }

          return {
            id: place.place_id || `place-google-${idx}`,
            name: place.name,
            address: place.formatted_address || place.vicinity || 'Tbilisi, Georgia',
            location: place.vicinity || place.formatted_address?.split(',')[0] || 'Tbilisi',
            latitude: place.geometry?.location?.lat || 41.7151,
            longitude: place.geometry?.location?.lng || 44.8271,
            imageUrl: photoUrl,
            selectedPhotoUrl: photoUrl,
            selectedPhotoAttribution: photoAttr,
            rating: place.rating || 4.5,
            placeId: place.place_id,
            sport: sport || 'Sports',
            price: 15.0,
          };
        });
      }
    } catch (err) {
      console.warn('Google Places API search failed, returning fallback real venues:', err);
    }
  }

  // Fallback to real stadium list filtered by sport & search term
  const normSport = sport.toLowerCase();
  const normQuery = query.toLowerCase();

  const filtered = REAL_FALLBACK_VENUES.filter((v) => {
    const matchSport = !sport || v.sport.toLowerCase().includes(normSport) || normSport.includes(v.sport.toLowerCase());
    const matchQuery = !query || v.name.toLowerCase().includes(normQuery) || v.address.toLowerCase().includes(normQuery);
    return matchSport && matchQuery;
  });

  if (filtered.length > 0) {
    return filtered;
  }

  // Return all venues if filter is empty
  return REAL_FALLBACK_VENUES.filter((v) => !sport || v.sport.toLowerCase().includes(normSport));
}
