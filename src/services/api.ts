import type {
  AuthResponse,
  User,
  Stadium,
  VenuePlace,
  Game,
  GamePlayer,
  AvailabilityResponse,
  CreateGameData,
} from '../types/api';
import { SEED_STADIUMS, FALLBACK_VENUES } from './localSeed';

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


const DB_KEY = 'playTogether_db_v1';
const TOKEN_KEY = 'playTogetherToken';

interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

interface DbGame {
  id: string;
  stadiumId: string;
  creatorId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  selectedPhotoUrl?: string;
  selectedPhotoAttribution?: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface DbSubscription {
  id: string;
  userId: string;
  tier: 'SILVER' | 'GOLD' | 'UNLIMITED';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  durationMonths: number;
  startDate: string;
  endDate: string;
  pricePaid: number;
  createdAt: string;
}

interface Db {
  users: DbUser[];
  stadiums: Stadium[];
  games: DbGame[];
  gamePlayers: GamePlayer[];
  subscriptions: DbSubscription[];
  instructorBookings: InstructorBooking[];
}

const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

async function hashPassword(password: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(`playtogether:${password}`);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    let h = 5381;
    for (const c of `playtogether:${password}`) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
    return `fallback-${h}`;
  }
}

function seedDb(): Db {
  const now = new Date().toISOString();
  return {
    users: [],
    stadiums: SEED_STADIUMS.map((s) => ({ ...s, id: uid(), createdAt: now })),
    games: [],
    gamePlayers: [],
    subscriptions: [],
    instructorBookings: [],
  };
}

let memoryDb: Db | null = null;

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Db;
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.stadiums)) return parsed;
    }
    const fresh = seedDb();
    localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    if (!memoryDb) memoryDb = seedDb();
    return memoryDb;
  }
}

function saveDb(db: Db): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    memoryDb = db;
  }
}

let adminEnsured = false;
async function ensureAdmin(): Promise<void> {
  if (adminEnsured) return;
  adminEnsured = true;
  const db = loadDb();
  if (!db.users.some((u) => u.email === 'admin@playtogether.ge')) {
    db.users.push({
      id: uid(),
      name: 'Admin',
      email: 'admin@playtogether.ge',
      passwordHash: await hashPassword('Admin@PT2025'),
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
  }
}


const publicUser = (u: DbUser): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

const slimUser = (u?: DbUser) =>
  u ? ({ id: u.id, name: u.name, email: u.email } as User) : undefined;

function currentUserId(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || !token.startsWith('local.')) throw new ApiError('Authentication required', 401);
  const id = token.slice('local.'.length);
  if (!loadDb().users.some((u) => u.id === id)) throw new ApiError('Unauthorized', 401);
  return id;
}

function requireAdmin(): string {
  const id = currentUserId();
  const u = loadDb().users.find((x) => x.id === id);
  if (!u || u.role !== 'ADMIN') throw new ApiError('Admin access required', 403);
  return id;
}

function expandGame(db: Db, g: DbGame): Game {
  return {
    ...g,
    stadium: db.stadiums.find((s) => s.id === g.stadiumId),
    creator: slimUser(db.users.find((u) => u.id === g.creatorId)),
    players: db.gamePlayers
      .filter((p) => p.gameId === g.id)
      .map((p) => ({ ...p, user: slimUser(db.users.find((u) => u.id === p.userId)) })),
  };
}

const byDateTime = (a: DbGame, b: DbGame) =>
  a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validation(errors: Array<{ field: string; message: string }>): never {
  throw new ApiError(errors.map((e) => `${e.field}: ${e.message}`).join(', '), 400, errors);
}

function dayStartIso(date: string): string {
  const [y, m, d] = date.split('-').map((n) => parseInt(n, 10));
  if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(Date.UTC(y, m - 1, d)).toISOString();
  const dt = new Date(date);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString();
}

const dayOf = (iso: string) => iso.slice(0, 10);

function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

const WEEKLY_LIMITS: Record<string, number> = { SILVER: 2, GOLD: 3 };

const tick = <T,>(fn: () => T | Promise<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      Promise.resolve()
        .then(fn)
        .then(resolve, reject);
    }, 60);
  });

const makeToken = (userId: string) => `local.${userId}`;


export const api = {
  register: (data: { name: string; email: string; password: string }): Promise<AuthResponse> =>
    tick(async () => {
      await ensureAdmin();
      const errors: Array<{ field: string; message: string }> = [];
      if (!data.name || data.name.length < 2) errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
      if (!EMAIL_RE.test(data.email || '')) errors.push({ field: 'email', message: 'Invalid email address' });
      if (!data.password || data.password.length < 6) errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
      if (errors.length) validation(errors);

      const db = loadDb();
      const email = data.email.toLowerCase();
      if (db.users.some((u) => u.email === email)) throw new ApiError('User with this email already exists', 409);

      const user: DbUser = {
        id: uid(),
        name: data.name,
        email,
        passwordHash: await hashPassword(data.password),
        role: 'USER',
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      saveDb(db);
      return { message: 'User registered successfully', user: publicUser(user), token: makeToken(user.id) };
    }),

  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    tick(async () => {
      await ensureAdmin();
      if (!EMAIL_RE.test(data.email || '')) validation([{ field: 'email', message: 'Invalid email address' }]);
      if (!data.password) validation([{ field: 'password', message: 'Password is required' }]);

      const db = loadDb();
      const user = db.users.find((u) => u.email === data.email.toLowerCase());
      if (!user || user.passwordHash !== (await hashPassword(data.password))) {
        throw new ApiError('Invalid email or password', 401);
      }
      return { message: 'Logged in successfully', user: publicUser(user), token: makeToken(user.id) };
    }),

  me: (): Promise<{ user: User }> =>
    tick(async () => {
      await ensureAdmin();
      const id = currentUserId();
      const user = loadDb().users.find((u) => u.id === id);
      if (!user) throw new ApiError('User not found', 404);
      return { user: publicUser(user) };
    }),

  getStadiums: (sport?: string): Promise<{ stadiums: Stadium[] }> =>
    tick(() => {
      const db = loadDb();
      let list = db.stadiums;
      if (sport) list = list.filter((s) => s.sport === sport);
      return { stadiums: [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
    }),

  searchVenues: (sport: string, query?: string): Promise<{ venues: VenuePlace[] }> =>
    tick(() => {
      const normSport = (sport || '').toLowerCase();
      const normQuery = (query || '').toLowerCase();
      let places = FALLBACK_VENUES.filter((v) => {
        const matchSport = !sport || v.sport.toLowerCase().includes(normSport) || normSport.includes(v.sport.toLowerCase());
        const matchQuery = !query || v.name.toLowerCase().includes(normQuery) || v.address.toLowerCase().includes(normQuery);
        return matchSport && matchQuery;
      });
      if (!places.length) places = FALLBACK_VENUES.filter((v) => !sport || v.sport.toLowerCase().includes(normSport));

      const combined: VenuePlace[] = [...places];
      for (const st of loadDb().stadiums) {
        if (sport && st.sport !== sport) continue;
        if (combined.some((p) => p.name.toLowerCase() === st.name.toLowerCase())) continue;
        combined.push({
          id: st.id,
          name: st.name,
          address: st.address || st.location,
          location: st.location,
          latitude: st.latitude || 41.7151,
          longitude: st.longitude || 44.8271,
          imageUrl: st.imageUrl,
          selectedPhotoUrl: st.selectedPhotoUrl || st.imageUrl,
          selectedPhotoAttribution: st.selectedPhotoAttribution || undefined,
          rating: st.rating || 4.7,
          placeId: st.placeId || st.id,
          sport: st.sport,
          price: st.price,
        });
      }
      return { venues: combined };
    }),

  getStadiumById: (id: string): Promise<{ stadium: Stadium & { games: Game[] } }> =>
    tick(() => {
      const db = loadDb();
      const stadium = db.stadiums.find((s) => s.id === id);
      if (!stadium) throw new ApiError('Stadium not found', 404);
      const games = db.games
        .filter((g) => g.stadiumId === id && g.status === 'UPCOMING')
        .sort(byDateTime)
        .map((g) => expandGame(db, g));
      return { stadium: { ...stadium, games } };
    }),

  checkAvailability: (
    stadiumId: string,
    date: string,
    startTime?: string,
    endTime?: string
  ): Promise<AvailabilityResponse> =>
    tick(() => {
      if (!date) throw new ApiError('Date query parameter is required (YYYY-MM-DD)', 400);
      const db = loadDb();
      const bookedSlots = db.games
        .filter((g) => g.stadiumId === stadiumId && g.status === 'UPCOMING' && dayOf(g.date) === date)
        .map((g) => ({ id: g.id, title: g.title, date: g.date, startTime: g.startTime, endTime: g.endTime }));

      if (!startTime || !endTime) return { available: true, stadiumId, date, bookedSlots };

      const conflictingGame = bookedSlots.find((g) => startTime < g.endTime && endTime > g.startTime);
      if (conflictingGame) {
        return { available: false, message: 'Time slot is already occupied.', conflictingGame, bookedSlots };
      }
      return { available: true, message: 'Time slot is available for booking.', stadiumId, date, startTime, endTime, bookedSlots };
    }),

  getGames: (params?: { stadiumId?: string; sport?: string; date?: string }): Promise<{ games: Game[] }> =>
    tick(() => {
      const db = loadDb();
      let list = db.games.filter((g) => g.status === 'UPCOMING');
      if (params?.stadiumId) list = list.filter((g) => g.stadiumId === params.stadiumId);
      if (params?.sport) {
        list = list.filter((g) => {
          const st = db.stadiums.find((s) => s.id === g.stadiumId);
          return st?.sport?.toLowerCase() === params.sport!.toLowerCase();
        });
      }
      if (params?.date) list = list.filter((g) => dayOf(g.date) === params.date);
      return { games: list.sort(byDateTime).map((g) => expandGame(db, g)) };
    }),

  getGameById: (id: string): Promise<{ game: Game }> =>
    tick(() => {
      const db = loadDb();
      const game = db.games.find((g) => g.id === id);
      if (!game) throw new ApiError('Game not found', 404);
      return { game: expandGame(db, game) };
    }),

  createGame: (data: CreateGameData): Promise<{ message: string; game: Game }> =>
    tick(() => {
      const userId = currentUserId();
      const errors: Array<{ field: string; message: string }> = [];
      if (!data.stadiumId) errors.push({ field: 'stadiumId', message: 'Required' });
      if (!data.date || isNaN(Date.parse(data.date))) errors.push({ field: 'date', message: 'Invalid date format' });
      if (!TIME_RE.test(data.startTime || '')) errors.push({ field: 'startTime', message: 'startTime must be HH:mm format (e.g. 20:00)' });
      if (!TIME_RE.test(data.endTime || '')) errors.push({ field: 'endTime', message: 'endTime must be HH:mm format (e.g. 22:00)' });
      if (data.title !== undefined && data.title.length < 3) errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
      if (data.maxPlayers !== undefined && (!Number.isInteger(data.maxPlayers) || data.maxPlayers < 1 || data.maxPlayers > 100)) {
        errors.push({ field: 'maxPlayers', message: 'maxPlayers must be between 1 and 100' });
      }
      if (errors.length) validation(errors);

      if (data.startTime >= data.endTime) throw new ApiError('startTime must be earlier than endTime', 400);

      const db = loadDb();
      let stadium = db.stadiums.find((s) => s.id === data.stadiumId);
      if (!stadium) {
        stadium = {
          id: data.stadiumId,
          name: data.venueName || 'Sports Stadium',
          description: 'Booked via PlayTogether',
          location: data.venueLocation || 'Tbilisi',
          address: data.venueAddress || data.venueLocation || 'Tbilisi',
          sport: data.sport || 'Football',
          imageUrl:
            data.selectedPhotoUrl ||
            'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
          selectedPhotoUrl: data.selectedPhotoUrl,
          selectedPhotoAttribution: data.selectedPhotoAttribution,
          price: 15.0,
          createdAt: new Date().toISOString(),
        };
        db.stadiums.push(stadium);
      }

      const day = dayStartIso(data.date);
      const conflict = db.games.some(
        (g) =>
          g.stadiumId === data.stadiumId &&
          g.status === 'UPCOMING' &&
          dayOf(g.date) === dayOf(day) &&
          data.startTime < g.endTime &&
          data.endTime > g.startTime
      );
      if (conflict) throw new ApiError('Stadium is already booked for the requested date and time slot.', 409);

      const now = new Date().toISOString();
      const game: DbGame = {
        id: uid(),
        stadiumId: data.stadiumId,
        creatorId: userId,
        title: data.title || `${stadium.sport || data.sport || 'Sports'} Match at ${stadium.name || data.venueName || 'Stadium'}`,
        date: day,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPlayers: data.maxPlayers || 10,
        selectedPhotoUrl: data.selectedPhotoUrl,
        selectedPhotoAttribution: data.selectedPhotoAttribution,
        status: 'UPCOMING',
        createdAt: now,
      };
      db.games.push(game);
      db.gamePlayers.push({ id: uid(), gameId: game.id, userId, joinedAt: now });
      saveDb(db);
      return { message: 'Game created and booked successfully', game: expandGame(db, game) };
    }),

  joinGame: (gameId: string): Promise<{ message: string; game: Game }> =>
    tick(() => {
      const userId = currentUserId();
      const db = loadDb();
      const game = db.games.find((g) => g.id === gameId);
      if (!game) throw new ApiError('Game not found', 404);
      if (game.status !== 'UPCOMING') throw new ApiError('Cannot join a game that is not upcoming', 400);
      const players = db.gamePlayers.filter((p) => p.gameId === gameId);
      if (players.length >= (game.maxPlayers || 10)) throw new ApiError('Game is full. Cannot join this match.', 400);
      if (players.some((p) => p.userId === userId)) throw new ApiError('You have already joined this game', 409);
      db.gamePlayers.push({ id: uid(), gameId, userId, joinedAt: new Date().toISOString() });
      saveDb(db);
      return { message: 'Joined game successfully', game: expandGame(db, game) };
    }),

  leaveGame: (gameId: string): Promise<{ message: string }> =>
    tick(() => {
      const userId = currentUserId();
      const db = loadDb();
      const idx = db.gamePlayers.findIndex((p) => p.gameId === gameId && p.userId === userId);
      if (idx === -1) throw new ApiError('You are not a member of this game', 404);
      db.gamePlayers.splice(idx, 1);
      saveDb(db);
      return { message: 'Left game successfully' };
    }),

  getMySubscription: (): Promise<{ subscription: any; weeklyUsage: any }> =>
    tick(() => {
      const userId = currentUserId();
      const db = loadDb();
      const now = new Date();
      let changed = false;
      for (const s of db.subscriptions) {
        if (s.userId === userId && s.status === 'ACTIVE' && new Date(s.endDate) < now) {
          s.status = 'EXPIRED';
          changed = true;
        }
      }
      if (changed) saveDb(db);

      const sub = db.subscriptions
        .filter((s) => s.userId === userId && s.status === 'ACTIVE')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      if (!sub) return { subscription: null, weeklyUsage: null };

      const limit = WEEKLY_LIMITS[sub.tier];
      const creditsUsed = 0;
      return {
        subscription: {
          id: sub.id,
          tier: sub.tier,
          status: sub.status,
          durationMonths: sub.durationMonths,
          startDate: sub.startDate,
          endDate: sub.endDate,
          pricePaid: sub.pricePaid,
        },
        weeklyUsage: {
          weekKey: getWeekKey(now),
          creditsUsed,
          creditsRemaining: sub.tier === 'UNLIMITED' ? null : Math.max(0, limit - creditsUsed),
          weeklyLimit: sub.tier === 'UNLIMITED' ? null : limit,
        },
      };
    }),

  subscribe: (data: { tier: string; durationMonths: number; pricePaid: number }): Promise<{ message: string; subscription: any }> =>
    tick(() => {
      const userId = currentUserId();
      if (!['SILVER', 'GOLD', 'UNLIMITED'].includes(data.tier)) validation([{ field: 'tier', message: 'Invalid tier' }]);
      if (!Number.isInteger(data.durationMonths) || data.durationMonths < 1 || data.durationMonths > 12) {
        validation([{ field: 'durationMonths', message: 'durationMonths must be between 1 and 12' }]);
      }
      if (!(data.pricePaid > 0)) validation([{ field: 'pricePaid', message: 'pricePaid must be positive' }]);

      const db = loadDb();
      for (const s of db.subscriptions) {
        if (s.userId === userId && s.status === 'ACTIVE') s.status = 'CANCELLED';
      }
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + data.durationMonths);
      const sub: DbSubscription = {
        id: uid(),
        userId,
        tier: data.tier as DbSubscription['tier'],
        status: 'ACTIVE',
        durationMonths: data.durationMonths,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        pricePaid: data.pricePaid,
        createdAt: now.toISOString(),
      };
      db.subscriptions.push(sub);
      saveDb(db);
      return { message: `PlayPass ${data.tier} activated successfully!`, subscription: sub };
    }),

  cancelSubscription: (): Promise<{ message: string }> =>
    tick(() => {
      const userId = currentUserId();
      const db = loadDb();
      const active = db.subscriptions.filter((s) => s.userId === userId && s.status === 'ACTIVE');
      if (!active.length) throw new ApiError('No active subscription found', 404);
      active.forEach((s) => (s.status = 'CANCELLED'));
      saveDb(db);
      return { message: 'Subscription cancelled successfully.' };
    }),

  createInstructorBooking: (data: {
    instructorId: string;
    instructorName: string;
    sport: string;
    lessonType: '1-on-1' | 'Group Coaching';
    slot: string;
    amount: number;
    notes?: string;
  }): Promise<{ message: string; booking: InstructorBooking }> =>
    tick(() => {
      const userId = currentUserId();
      const errors: Array<{ field: string; message: string }> = [];
      if (!data.instructorId) errors.push({ field: 'instructorId', message: 'Instructor ID is required' });
      if (!data.instructorName) errors.push({ field: 'instructorName', message: 'Instructor name is required' });
      if (!data.sport) errors.push({ field: 'sport', message: 'Sport is required' });
      if (!['1-on-1', 'Group Coaching'].includes(data.lessonType)) errors.push({ field: 'lessonType', message: 'Invalid lesson type' });
      if (!data.slot) errors.push({ field: 'slot', message: 'Time slot is required' });
      if (!(data.amount > 0)) errors.push({ field: 'amount', message: 'Amount must be a positive number' });
      if (errors.length) validation(errors);

      const db = loadDb();
      const live = db.instructorBookings.filter((b) => b.instructorId === data.instructorId && b.slot === data.slot && b.status !== 'CANCELLED');
      if (live.some((b) => b.userId === userId)) {
        throw new ApiError('You already have a booking for this slot with this instructor', 409);
      }
      if (data.lessonType === '1-on-1' && live.some((b) => b.lessonType === '1-on-1')) {
        throw new ApiError('This 1-on-1 slot is already booked with this instructor. Please choose another slot.', 409);
      }

      const now = new Date().toISOString();
      const user = db.users.find((u) => u.id === userId);
      const booking: InstructorBooking = {
        id: uid(),
        userId,
        instructorId: data.instructorId,
        instructorName: data.instructorName,
        sport: data.sport,
        lessonType: data.lessonType,
        slot: data.slot,
        amount: data.amount,
        status: 'PENDING',
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
        user: user ? { id: user.id, name: user.name, email: user.email } : undefined,
      };
      db.instructorBookings.push(booking);
      saveDb(db);
      return { message: 'Booking created successfully', booking };
    }),

  getMyInstructorBookings: (): Promise<{ bookings: InstructorBooking[] }> =>
    tick(() => {
      const userId = currentUserId();
      const bookings = loadDb()
        .instructorBookings.filter((b) => b.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return { bookings };
    }),

  admin: {
    getStats: (): Promise<{ stats: AdminStats }> =>
      tick(() => {
        requireAdmin();
        const db = loadDb();
        return {
          stats: {
            totalUsers: db.users.length,
            totalInstructorBookings: db.instructorBookings.length,
            totalGames: db.games.length,
            activeSubscriptions: db.subscriptions.filter((s) => s.status === 'ACTIVE').length,
          },
        };
      }),
    getBookings: (): Promise<{ bookings: InstructorBooking[] }> =>
      tick(() => {
        requireAdmin();
        const bookings = [...loadDb().instructorBookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return { bookings };
      }),
    getUsers: (): Promise<{ users: AdminUser[] }> =>
      tick(() => {
        requireAdmin();
        const db = loadDb();
        const users = [...db.users]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
            _count: {
              instructorBookings: db.instructorBookings.filter((b) => b.userId === u.id).length,
              createdGames: db.games.filter((g) => g.creatorId === u.id).length,
            },
          }));
        return { users };
      }),
  },
};

export interface InstructorBooking {
  id: string;
  userId: string;
  instructorId: string;
  instructorName: string;
  sport: string;
  lessonType: '1-on-1' | 'Group Coaching';
  slot: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
}

export interface AdminStats {
  totalUsers: number;
  totalInstructorBookings: number;
  totalGames: number;
  activeSubscriptions: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    instructorBookings: number;
    createdGames: number;
  };
}


