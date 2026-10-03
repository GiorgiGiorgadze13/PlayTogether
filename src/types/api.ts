export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Stadium {
  id: string;
  name: string;
  description: string;
  location: string;
  sport: string;
  imageUrl: string;
  price: number;
  createdAt: string;
}

export interface GamePlayer {
  id: string;
  gameId: string;
  userId: string;
  joinedAt: string;
  user?: User;
}

export interface Game {
  id: string;
  stadiumId: string;
  creatorId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  stadium?: Stadium;
  creator?: User;
  players?: GamePlayer[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AvailabilityResponse {
  available?: boolean;
  message?: string;
  stadiumId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  bookedSlots?: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }>;
  conflictingGame?: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface CreateGameData {
  stadiumId: string;
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
}
