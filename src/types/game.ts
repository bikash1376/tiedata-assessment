export type GameStatus = 'scheduled' | 'live' | 'final';

export interface TeamRecord {
  wins: number;
  losses: number;
}

export interface TeamMetrics {
  offensiveRating: number;
  defensiveRating: number;
  pace: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  record: TeamRecord;
  metrics: TeamMetrics;
  keyPlayers: Player[];
}

export interface Game {
  id: string;
  scheduledAt: string;
  status: GameStatus;
  venue: string;

  homeScore?: number;
  awayScore?: number;

  period?: number;
  clock?: string;
  homeTeam: Team;
  awayTeam: Team;
}

export interface GamesPayload {
  generatedAt: string;
  games: Game[];
}
