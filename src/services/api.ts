import type {
  AuthResponse,
  User,
  Stadium,
  VenuePlace,
  Game,
  AvailabilityResponse,
  CreateGameData,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('playTogetherToken');
};

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
      data.errors
    );
  }

  return data as T;
}

export const api = {
  // Auth API
  register: (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: (data: { email: string; password: string }): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  me: (): Promise<{ user: User }> => {
    return fetchApi<{ user: User }>('/auth/me', {
      method: 'GET',
    });
  },

  // Stadium API
  getStadiums: (sport?: string): Promise<{ stadiums: Stadium[] }> => {
    const query = sport ? `?sport=${encodeURIComponent(sport)}` : '';
    return fetchApi<{ stadiums: Stadium[] }>(`/stadiums${query}`, {
      method: 'GET',
    });
  },

  searchVenues: (sport: string, query?: string): Promise<{ venues: VenuePlace[] }> => {
    const params = new URLSearchParams({ sport: sport || '' });
    if (query) params.append('query', query);
    return fetchApi<{ venues: VenuePlace[] }>(`/stadiums/search?${params.toString()}`, {
      method: 'GET',
    });
  },

  getStadiumById: (id: string): Promise<{ stadium: Stadium & { games: Game[] } }> => {
    return fetchApi<{ stadium: Stadium & { games: Game[] } }>(`/stadiums/${id}`, {
      method: 'GET',
    });
  },

  checkAvailability: async (
    stadiumId: string,
    date: string,
    startTime?: string,
    endTime?: string
  ): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams({ date });
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);

    try {
      return await fetchApi<AvailabilityResponse>(`/stadiums/${stadiumId}/availability?${params.toString()}`, {
        method: 'GET',
      });
    } catch {
      // Check local storage custom games for slot conflicts when backend is unreachable
      const customGames: Game[] = JSON.parse(localStorage.getItem('playTogether_custom_games') || '[]');
      const dayGames = customGames.filter((g) => g.stadiumId === stadiumId && g.date.startsWith(date));
      const bookedSlots = dayGames.map((g) => ({
        id: g.id,
        title: g.title,
        date: g.date,
        startTime: g.startTime,
        endTime: g.endTime,
      }));

      const isConflicting =
        startTime && endTime && bookedSlots.some((b) => startTime < b.endTime && endTime > b.startTime);
      return {
        available: !isConflicting,
        message: isConflicting ? 'Slot already booked.' : 'Venue open for booking.',
        bookedSlots,
      };
    }
  },

  // Games API
  getGames: async (params?: { stadiumId?: string; sport?: string; date?: string }): Promise<{ games: Game[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.stadiumId) queryParams.append('stadiumId', params.stadiumId);
    if (params?.sport) queryParams.append('sport', params.sport);
    if (params?.date) queryParams.append('date', params.date);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    let apiGames: Game[] = [];
    try {
      const res = await fetchApi<{ games: Game[] }>(`/games${query}`, {
        method: 'GET',
      });
      apiGames = res.games || [];
    } catch {
      apiGames = [];
    }

    const customGames: Game[] = JSON.parse(localStorage.getItem('playTogether_custom_games') || '[]');
    const combined = [...customGames, ...apiGames];

    let filtered = combined;
    if (params?.stadiumId) {
      filtered = filtered.filter((g) => g.stadiumId === params.stadiumId);
    }
    if (params?.sport) {
      filtered = filtered.filter(
        (g) => g.stadium?.sport?.toLowerCase() === params.sport?.toLowerCase()
      );
    }
    if (params?.date) {
      filtered = filtered.filter((g) => g.date.startsWith(params.date!));
    }

    return { games: filtered };
  },

  getGameById: (id: string): Promise<{ game: Game }> => {
    return fetchApi<{ game: Game }>(`/games/${id}`, {
      method: 'GET',
    });
  },

  createGame: (data: CreateGameData): Promise<{ message: string; game: Game }> => {
    return fetchApi<{ message: string; game: Game }>('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  joinGame: (gameId: string): Promise<{ message: string; game: Game }> => {
    return fetchApi<{ message: string; game: Game }>(`/games/${gameId}/join`, {
      method: 'POST',
    });
  },

  leaveGame: (gameId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/games/${gameId}/leave`, {
      method: 'DELETE',
    });
  },
};
