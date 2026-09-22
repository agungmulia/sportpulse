import type { Match, Team, League } from './api';

const now = new Date();
const msAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const msFrom = (m: number) => new Date(now.getTime() + m * 60000).toISOString();

// ─── Teams ────────────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Record<string, Team> = {
  arsenal: {
    id: 't1', name: 'Arsenal', slug: 'arsenal',
    logo: 'https://media.api-sports.io/football/teams/42.png',
    country: 'England', founded: 1886,
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: null },
  },
  chelsea: {
    id: 't2', name: 'Chelsea', slug: 'chelsea',
    logo: 'https://media.api-sports.io/football/teams/49.png',
    country: 'England', founded: 1905,
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: null },
  },
  barcelona: {
    id: 't3', name: 'Barcelona', slug: 'barcelona',
    logo: 'https://media.api-sports.io/football/teams/529.png',
    country: 'Spain', founded: 1899,
    league: { id: 'l2', name: 'La Liga', slug: 'la-liga', logo: null },
  },
  'real-madrid': {
    id: 't4', name: 'Real Madrid', slug: 'real-madrid',
    logo: 'https://media.api-sports.io/football/teams/541.png',
    country: 'Spain', founded: 1902,
    league: { id: 'l2', name: 'La Liga', slug: 'la-liga', logo: null },
  },
  'manchester-city': {
    id: 't5', name: 'Manchester City', slug: 'manchester-city',
    logo: 'https://media.api-sports.io/football/teams/50.png',
    country: 'England', founded: 1880,
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: null },
  },
  'liverpool': {
    id: 't6', name: 'Liverpool', slug: 'liverpool',
    logo: 'https://media.api-sports.io/football/teams/40.png',
    country: 'England', founded: 1892,
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: null },
  },
  'persib': {
    id: 't7', name: 'Persib Bandung', slug: 'persib',
    logo: null, country: 'Indonesia', founded: 1933,
    league: { id: 'l3', name: 'Liga 1 Indonesia', slug: 'liga-1', logo: null },
  },
  'persija': {
    id: 't8', name: 'Persija Jakarta', slug: 'persija',
    logo: null, country: 'Indonesia', founded: 1928,
    league: { id: 'l3', name: 'Liga 1 Indonesia', slug: 'liga-1', logo: null },
  },
};

// ─── Leagues ──────────────────────────────────────────────────────────────────

export const MOCK_LEAGUES: Record<string, League> = {
  'premier-league': {
    id: 'l1', name: 'Premier League', slug: 'premier-league',
    logo: 'https://media.api-sports.io/football/leagues/39.png', country: 'England',
  },
  'la-liga': {
    id: 'l2', name: 'La Liga', slug: 'la-liga',
    logo: 'https://media.api-sports.io/football/leagues/140.png', country: 'Spain',
  },
  'liga-1': {
    id: 'l3', name: 'Liga 1 Indonesia', slug: 'liga-1', logo: null, country: 'Indonesia',
  },
};

// ─── Matches ──────────────────────────────────────────────────────────────────

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    slug: 'barcelona-vs-real-madrid-el-clasico',
    status: 'LIVE',
    kickoffAt: msAgo(55),
    homeScore: 2,
    awayScore: 1,
    homeTeam: { id: 't3', name: 'Barcelona', slug: 'barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
    awayTeam: { id: 't4', name: 'Real Madrid', slug: 'real-madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    league: { id: 'l2', name: 'La Liga', slug: 'la-liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
    stats: { homePossession: 58, awayPossession: 42, homeShots: 14, awayShots: 8, homeShotsOnTarget: 6, awayShotsOnTarget: 3, homeCorners: 7, awayCorners: 3, homeFouls: 9, awayFouls: 12 },
    events: [
      { id: 'e1', minute: 12, type: 'GOAL', detail: 'Lewandowski (Assist: Raphinha)', teamId: 't3', playerId: null },
      { id: 'e2', minute: 34, type: 'GOAL', detail: 'Vinicius Jr. (Assist: Bellingham)', teamId: 't4', playerId: null },
      { id: 'e3', minute: 41, type: 'YELLOW_CARD', detail: 'Fede Valverde', teamId: 't4', playerId: null },
      { id: 'e4', minute: 51, type: 'GOAL', detail: 'Yamal (Assist: Dani Olmo)', teamId: 't3', playerId: null },
    ],
    lineups: [],
    prediction: {
      winProbabilityHome: 0.52,
      winProbabilityDraw: 0.24,
      winProbabilityAway: 0.24,
      overUnderLine: 2.5,
      overProbability: 0.72,
      underProbability: 0.28,
      confidenceScore: 0.81,
    },
    aiArticle: {
      title: 'El Clásico: Barcelona Dominate as Yamal Shines',
      summary: 'Barcelona put in a commanding performance in El Clásico, with teenage sensation Lamine Yamal delivering a match-winning contribution.',
      content: 'Barcelona are on course for a memorable El Clásico victory at Camp Nou. The hosts have controlled possession throughout, with Lewandowski opening the scoring before Vinicius equalized for Real Madrid. However, Barcelona\'s fluid attacking play proved too much as Yamal\'s brilliant assist set up the winning goal in the second half. Raphinha and Dani Olmo have been outstanding in midfield, denying Real Madrid any rhythm.',
    },
  },
  {
    id: 'm2',
    slug: 'arsenal-vs-chelsea-premier-league',
    status: 'LIVE',
    kickoffAt: msAgo(20),
    homeScore: 1,
    awayScore: 0,
    homeTeam: { id: 't1', name: 'Arsenal', slug: 'arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
    awayTeam: { id: 't2', name: 'Chelsea', slug: 'chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    stats: { homePossession: 53, awayPossession: 47, homeShots: 7, awayShots: 5, homeShotsOnTarget: 3, awayShotsOnTarget: 1, homeCorners: 4, awayCorners: 2, homeFouls: 6, awayFouls: 8 },
    events: [
      { id: 'e5', minute: 18, type: 'GOAL', detail: 'Saka (Assist: Ødegaard)', teamId: 't1', playerId: null },
    ],
    lineups: [],
    prediction: {
      winProbabilityHome: 0.48,
      winProbabilityDraw: 0.27,
      winProbabilityAway: 0.25,
      overUnderLine: 2.5,
      overProbability: 0.61,
      underProbability: 0.39,
      confidenceScore: 0.74,
    },
    aiArticle: null,
  },
  {
    id: 'm3',
    slug: 'manchester-city-vs-liverpool-premier-league',
    status: 'SCHEDULED',
    kickoffAt: msFrom(90),
    homeScore: null,
    awayScore: null,
    homeTeam: { id: 't5', name: 'Manchester City', slug: 'manchester-city', logo: 'https://media.api-sports.io/football/teams/50.png' },
    awayTeam: { id: 't6', name: 'Liverpool', slug: 'liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    stats: null,
    events: [],
    lineups: [],
    prediction: {
      winProbabilityHome: 0.43,
      winProbabilityDraw: 0.25,
      winProbabilityAway: 0.32,
      overUnderLine: 2.5,
      overProbability: 0.68,
      underProbability: 0.32,
      confidenceScore: 0.77,
    },
    aiArticle: null,
  },
  {
    id: 'm4',
    slug: 'persib-vs-persija-liga-1',
    status: 'SCHEDULED',
    kickoffAt: msFrom(180),
    homeScore: null,
    awayScore: null,
    homeTeam: { id: 't7', name: 'Persib Bandung', slug: 'persib', logo: null },
    awayTeam: { id: 't8', name: 'Persija Jakarta', slug: 'persija', logo: null },
    league: { id: 'l3', name: 'Liga 1 Indonesia', slug: 'liga-1', logo: null },
    stats: null,
    events: [],
    lineups: [],
    prediction: {
      winProbabilityHome: 0.45,
      winProbabilityDraw: 0.3,
      winProbabilityAway: 0.25,
      overUnderLine: 2.5,
      overProbability: 0.55,
      underProbability: 0.45,
      confidenceScore: 0.65,
    },
    aiArticle: null,
  },
  {
    id: 'm5',
    slug: 'arsenal-vs-manchester-city-premier-league-finished',
    status: 'FINISHED',
    kickoffAt: msAgo(24 * 60),
    homeScore: 2,
    awayScore: 2,
    homeTeam: { id: 't1', name: 'Arsenal', slug: 'arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
    awayTeam: { id: 't5', name: 'Manchester City', slug: 'manchester-city', logo: 'https://media.api-sports.io/football/teams/50.png' },
    league: { id: 'l1', name: 'Premier League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    stats: { homePossession: 44, awayPossession: 56, homeShots: 12, awayShots: 15, homeShotsOnTarget: 4, awayShotsOnTarget: 5, homeCorners: 5, awayCorners: 8, homeFouls: 11, awayFouls: 9 },
    events: [
      { id: 'e6', minute: 23, type: 'GOAL', detail: 'Saka (Penalty)', teamId: 't1', playerId: null },
      { id: 'e7', minute: 45, type: 'GOAL', detail: 'Haaland', teamId: 't5', playerId: null },
      { id: 'e8', minute: 67, type: 'GOAL', detail: 'Martinelli', teamId: 't1', playerId: null },
      { id: 'e9', minute: 88, type: 'GOAL', detail: 'De Bruyne (Free kick)', teamId: 't5', playerId: null },
    ],
    lineups: [],
    prediction: null,
    aiArticle: {
      title: 'Arsenal vs Man City Ends in Thrilling 2-2 Draw',
      summary: 'A pulsating Premier League clash ended all square as De Bruyne\'s late free-kick cancelled out Martinelli\'s second-half strike.',
      content: 'Arsenal and Manchester City played out a breathless 2-2 draw at the Emirates Stadium. Bukayo Saka converted a first-half penalty to give Arsenal the lead, only for Erling Haaland to equalize before the break. Gabriel Martinelli restored Arsenal\'s advantage midway through the second half, but Kevin De Bruyne\'s stunning late free-kick earned City a point in a match that had everything.',
    },
  },
];

// ─── Mock API functions ───────────────────────────────────────────────────────

export const mockApi = {
  matches: {
    getLive: async () =>
      MOCK_MATCHES.filter((m) => ['LIVE', 'HALF_TIME'].includes(m.status)),

    getToday: async () => MOCK_MATCHES,

    getUpcoming: async () =>
      MOCK_MATCHES.filter((m) => m.status === 'SCHEDULED'),

    getBySlug: async (slug: string) => {
      const match = MOCK_MATCHES.find((m) => m.slug === slug);
      if (!match) throw new Error('Match not found');
      return match;
    },

    getByTeam: async (slug: string) => ({
      matches: MOCK_MATCHES.filter(
        (m) => m.homeTeam.slug === slug || m.awayTeam.slug === slug,
      ),
      total: MOCK_MATCHES.length,
      page: 1,
      limit: 10,
    }),

    getByLeague: async (slug: string) => ({
      matches: MOCK_MATCHES.filter((m) => m.league.slug === slug),
      total: MOCK_MATCHES.length,
      page: 1,
      limit: 20,
    }),
  },

  teams: {
    getBySlug: async (slug: string) => {
      const team = MOCK_TEAMS[slug];
      if (!team) throw new Error('Team not found');
      return team;
    },
  },

  leagues: {
    getBySlug: async (slug: string) => {
      const league = MOCK_LEAGUES[slug];
      if (!league) throw new Error('League not found');
      return league;
    },
  },

  predictions: {
    getRecent: async (limit = 10) =>
      MOCK_MATCHES.filter((m) => m.prediction)
        .slice(0, limit)
        .map((m) => ({ ...m.prediction, match: m })),

    getByMatch: async (slug: string) => {
      const match = MOCK_MATCHES.find((m) => m.slug === slug);
      return match?.prediction ?? null;
    },
  },

  ai: {
    getArticles: async () => ({
      articles: MOCK_MATCHES.filter((m) => m.aiArticle).map((m) => ({
        id: m.id,
        title: m.aiArticle!.title,
        slug: m.slug,
        summary: m.aiArticle!.summary,
        type: 'MATCH_SUMMARY',
        createdAt: m.kickoffAt,
      })),
      total: 2,
      page: 1,
      limit: 20,
    }),
  },

  search: {
    query: async (q: string) => {
      const lower = q.toLowerCase();
      return {
        teams: Object.values(MOCK_TEAMS).filter((t) =>
          t.name.toLowerCase().includes(lower),
        ),
        leagues: Object.values(MOCK_LEAGUES).filter((l) =>
          l.name.toLowerCase().includes(lower),
        ),
        matches: MOCK_MATCHES.filter(
          (m) =>
            m.homeTeam.name.toLowerCase().includes(lower) ||
            m.awayTeam.name.toLowerCase().includes(lower),
        ),
        players: [],
      };
    },

    autocomplete: async (q: string) => {
      const lower = q.toLowerCase();
      return {
        teams: Object.values(MOCK_TEAMS)
          .filter((t) => t.name.toLowerCase().startsWith(lower))
          .slice(0, 3)
          .map((t) => ({ ...t, type: 'team' })),
        leagues: Object.values(MOCK_LEAGUES)
          .filter((l) => l.name.toLowerCase().startsWith(lower))
          .slice(0, 2)
          .map((l) => ({ ...l, type: 'league' })),
        players: [],
      };
    },
  },

  auth: {
    login: async () => ({ accessToken: 'mock-token', refreshToken: 'mock-refresh', user: { id: 'u1', email: 'demo@sportpulse.ai', username: 'demo' } }),
    register: async () => ({ accessToken: 'mock-token', refreshToken: 'mock-refresh', user: { id: 'u1', email: 'demo@sportpulse.ai', username: 'demo' } }),
    refresh: async () => ({ accessToken: 'mock-token', refreshToken: 'mock-refresh' }),
  },
};
