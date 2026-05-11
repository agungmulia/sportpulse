// ─── Match ────────────────────────────────────────────────────────────────────

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'HALF_TIME'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED';

export type MatchEventType =
  | 'GOAL'
  | 'OWN_GOAL'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'VAR'
  | 'PENALTY_MISSED'
  | 'PENALTY_SCORED';

export interface IMatch {
  id: string;
  slug: string;
  status: MatchStatus;
  kickoffAt: Date;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: ITeamSummary;
  awayTeam: ITeamSummary;
  league: ILeagueSummary;
}

export interface IMatchStats {
  homePossession: number | null;
  awayPossession: number | null;
  homeShots: number | null;
  awayShots: number | null;
  homeShotsOnTarget: number | null;
  awayShotsOnTarget: number | null;
  homeCorners: number | null;
  awayCorners: number | null;
}

export interface IMatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  detail: string | null;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface ITeamSummary {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ITeam extends ITeamSummary {
  country: string | null;
  founded: number | null;
  venue: string | null;
  league: ILeagueSummary | null;
}

// ─── League ───────────────────────────────────────────────────────────────────

export interface ILeagueSummary {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ILeague extends ILeagueSummary {
  country: string | null;
  season: number | null;
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface IPlayer {
  id: string;
  name: string;
  slug: string;
  position: string | null;
  nationality: string | null;
  photo: string | null;
  age: number | null;
}

// ─── Prediction ───────────────────────────────────────────────────────────────

export interface IPrediction {
  winProbabilityHome: number;
  winProbabilityDraw: number;
  winProbabilityAway: number;
  overUnderLine: number;
  overProbability: number | null;
  underProbability: number | null;
  confidenceScore: number;
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export type AiArticleType =
  | 'MATCH_SUMMARY'
  | 'MATCH_PREVIEW'
  | 'TEAM_ANALYSIS'
  | 'PLAYER_SPOTLIGHT'
  | 'LEAGUE_ROUNDUP';

export interface IAiArticle {
  id: string;
  type: AiArticleType;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  keywords: string[];
  isPublished: boolean;
  createdAt: Date;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface IUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  role: UserRole;
  isPremium: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
