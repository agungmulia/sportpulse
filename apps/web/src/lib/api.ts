import axios from 'axios';
import { mockApi } from './mock-data';

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

if (IS_MOCK && typeof window === 'undefined') {
  console.log('\x1b[33m[SportPulse] Running with MOCK data — set NEXT_PUBLIC_USE_MOCK=false to use real API\x1b[0m');
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function get<T>(path: string): Promise<T> {
  const { data } = await http.get<{ data: T }>(path);
  return data.data;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await http.post<{ data: T }>(path, body);
  return data.data;
}

export const api = IS_MOCK
  ? {
      matches: {
        getLive: () => mockApi.matches.getLive() as Promise<unknown>,
        getToday: () => mockApi.matches.getToday() as Promise<unknown>,
        getUpcoming: () => mockApi.matches.getUpcoming() as Promise<unknown>,
        getBySlug: (slug: string) => mockApi.matches.getBySlug(slug),
        getByTeam: (slug: string) => mockApi.matches.getByTeam(slug),
        getByLeague: (slug: string) => mockApi.matches.getByLeague(slug),
      },
      teams: {
        getBySlug: (slug: string) => mockApi.teams.getBySlug(slug),
      },
      leagues: {
        getBySlug: (slug: string) => mockApi.leagues.getBySlug(slug),
      },
      predictions: {
        getRecent: (limit = 10) => mockApi.predictions.getRecent(limit) as Promise<unknown>,
        getByMatch: (slug: string) => mockApi.predictions.getByMatch(slug),
      },
      ai: {
        getArticles: () => mockApi.ai.getArticles() as Promise<unknown>,
      },
      search: {
        query: (q: string) => mockApi.search.query(q) as Promise<unknown>,
        autocomplete: (q: string) => mockApi.search.autocomplete(q) as Promise<unknown>,
      },
      auth: {
        login: (body: { email: string; password: string }) => mockApi.auth.login() as Promise<unknown>,
        register: (body: { email: string; username: string; password: string }) => mockApi.auth.register() as Promise<unknown>,
        refresh: (_token: string) => mockApi.auth.refresh() as Promise<unknown>,
      },
    }
  : {
      matches: {
        getLive: () => get('/api/v1/matches/live'),
        getToday: () => get('/api/v1/matches/today'),
        getUpcoming: (hours?: number) => get(`/api/v1/matches/upcoming${hours ? `?hours=${hours}` : ''}`),
        getBySlug: (slug: string) => get<Match>(`/api/v1/matches/${slug}`),
        getByTeam: (slug: string, page = 1) => get<{ matches: Match[] }>(`/api/v1/matches/team/${slug}?page=${page}`),
        getByLeague: (slug: string, page = 1) => get<{ matches: Match[] }>(`/api/v1/matches/league/${slug}?page=${page}`),
      },
      teams: {
        getBySlug: (slug: string) => get<Team>(`/api/v1/teams/${slug}`),
      },
      leagues: {
        getBySlug: (slug: string) => get<League>(`/api/v1/leagues/${slug}`),
      },
      predictions: {
        getRecent: (limit = 10) => get(`/api/v1/predictions?limit=${limit}`),
        getByMatch: (slug: string) => get(`/api/v1/predictions/match/${slug}`),
      },
      ai: {
        getArticles: (page = 1) => get(`/api/v1/ai/articles?page=${page}`),
      },
      search: {
        query: (q: string) => get(`/api/v1/search?q=${encodeURIComponent(q)}`),
        autocomplete: (q: string) => get(`/api/v1/search/autocomplete?q=${encodeURIComponent(q)}`),
      },
      auth: {
        login: (body: { email: string; password: string }) => post('/api/v1/auth/login', body),
        register: (body: { email: string; username: string; password: string }) => post('/api/v1/auth/register', body),
        refresh: (refreshToken: string) => post('/api/v1/auth/refresh', { refreshToken }),
      },
    };

// Shared types (minimal inline for server components)
export interface Match {
  id: string;
  slug: string;
  status: string;
  kickoffAt: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: { id: string; name: string; slug: string; logo: string | null };
  awayTeam: { id: string; name: string; slug: string; logo: string | null };
  league: { id: string; name: string; slug: string; logo: string | null };
  stats?: MatchStats | null;
  events?: MatchEvent[];
  lineups?: unknown[];
  prediction?: Prediction | null;
  aiArticle?: { title: string; summary: string | null; content: string } | null;
}

export interface MatchStats {
  homePossession: number | null;
  awayPossession: number | null;
  homeShots: number | null;
  awayShots: number | null;
  homeShotsOnTarget: number | null;
  awayShotsOnTarget: number | null;
  homeCorners: number | null;
  awayCorners: number | null;
  homeFouls: number | null;
  awayFouls: number | null;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: string;
  detail: string | null;
  teamId: string | null;
  playerId: string | null;
}

export interface Prediction {
  winProbabilityHome: number;
  winProbabilityDraw: number;
  winProbabilityAway: number;
  overUnderLine: number;
  overProbability: number | null;
  underProbability: number | null;
  confidenceScore: number;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
  founded: number | null;
  league?: { id: string; name: string } | null;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
}
