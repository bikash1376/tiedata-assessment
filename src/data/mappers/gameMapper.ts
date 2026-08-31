import type { Game, GameStatus, GamesPayload, Player, Team } from '../../types/game';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

const STATUSES: GameStatus[] = ['scheduled', 'live', 'final'];

const fail = (path: string, expected: string): never => {
  throw new ParseError('Expected ' + expected + ' at ' + path);
};

const obj = (value: unknown, path: string): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : fail(path, 'an object');

const str = (value: unknown, path: string): string =>
  typeof value === 'string' && value.length > 0 ? value : fail(path, 'a non-empty string');

const num = (value: unknown, path: string): number =>
  typeof value === 'number' && !Number.isNaN(value) ? value : fail(path, 'a number');

const optStr = (value: unknown, path: string) => (value == null ? undefined : str(value, path));

const optNum = (value: unknown, path: string) => (value == null ? undefined : num(value, path));

const toStatus = (value: unknown, path: string): GameStatus => {
  const status = str(value, path);
  return STATUSES.includes(status as GameStatus)
    ? (status as GameStatus)
    : fail(path, 'a known game status, got "' + status + '"');
};

const toPlayer = (raw: unknown, path: string): Player => {
  const p = obj(raw, path);
  return {
    id: str(p.id, path + '.id'),
    name: str(p.name, path + '.name'),
    position: str(p.position, path + '.position'),
    pointsPerGame: num(p.pointsPerGame, path + '.pointsPerGame'),
    reboundsPerGame: num(p.reboundsPerGame, path + '.reboundsPerGame'),
    assistsPerGame: num(p.assistsPerGame, path + '.assistsPerGame'),
    fieldGoalPercentage: num(p.fieldGoalPercentage, path + '.fieldGoalPercentage'),
    threePointPercentage: num(p.threePointPercentage, path + '.threePointPercentage'),
  };
};

const toTeam = (raw: unknown, path: string): Team => {
  const t = obj(raw, path);
  const record = obj(t.record, path + '.record');
  const metrics = obj(t.metrics, path + '.metrics');
  const roster = Array.isArray(t.keyPlayers) ? t.keyPlayers : [];

  return {
    id: str(t.id, path + '.id'),
    name: str(t.name, path + '.name'),
    abbreviation: str(t.abbreviation, path + '.abbreviation'),
    record: {
      wins: num(record.wins, path + '.record.wins'),
      losses: num(record.losses, path + '.record.losses'),
    },
    metrics: {
      offensiveRating: num(metrics.offensiveRating, path + '.metrics.offensiveRating'),
      defensiveRating: num(metrics.defensiveRating, path + '.metrics.defensiveRating'),
      pace: num(metrics.pace, path + '.metrics.pace'),
    },
    keyPlayers: roster.map((player, i) => toPlayer(player, path + '.keyPlayers[' + i + ']')),
  };
};

export const toGame = (raw: unknown, path = 'game'): Game => {
  const g = obj(raw, path);
  return {
    id: str(g.id, path + '.id'),
    scheduledAt: str(g.scheduledAt, path + '.scheduledAt'),
    status: toStatus(g.status, path + '.status'),
    venue: str(g.venue, path + '.venue'),
    homeScore: optNum(g.homeScore, path + '.homeScore'),
    awayScore: optNum(g.awayScore, path + '.awayScore'),
    period: optNum(g.period, path + '.period'),
    clock: optStr(g.clock, path + '.clock'),
    homeTeam: toTeam(g.homeTeam, path + '.homeTeam'),
    awayTeam: toTeam(g.awayTeam, path + '.awayTeam'),
  };
};

export const toGamesPayload = (raw: unknown): GamesPayload => {
  const root = obj(raw, 'root');
  if (!Array.isArray(root.games)) {
    fail('root.games', 'an array');
  }
  const meta = root.meta == null ? {} : obj(root.meta, 'root.meta');

  return {
    generatedAt: optStr(meta.generatedAt, 'root.meta.generatedAt') ?? new Date().toISOString(),
    games: (root.games as unknown[]).map((game, i) => toGame(game, 'root.games[' + i + ']')),
  };
};
