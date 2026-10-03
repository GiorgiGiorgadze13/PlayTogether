import type {
  AuthResponse,
  User,
  Stadium,
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

  getStadiumById: (id: string): Promise<{ stadium: Stadium & { games: Game[] } }> => {
    return fetchApi<{ stadium: Stadium & { games: Game[] } }>(`/stadiums/${id}`, {
      method: 'GET',
    });
  },

  checkAvailability: (
    stadiumId: string,
    date: string,
    startTime?: string,
    endTime?: string
  ): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams({ date });
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);

    return fetchApi<AvailabilityResponse>(`/stadiums/${stadiumId}/availability?${params.toString()}`, {
      method: 'GET',
    });
  },

  // Games API
  getGames: (params?: { stadiumId?: string; sport?: string; date?: string }): Promise<{ games: Game[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.stadiumId) queryParams.append('stadiumId', params.stadiumId);
    if (params?.sport) queryParams.append('sport', params.sport);
    if (params?.date) queryParams.append('date', params.date);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi<{ games: Game[] }>(`/games${query}`, {
      method: 'GET',
    });
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
