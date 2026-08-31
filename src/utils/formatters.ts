import type { Game, TeamRecord } from '../types/game';

export const formatGameTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatRecord = ({ wins, losses }: TeamRecord): string => `${wins}-${losses}`;

export const formatClock = (game: Game): string | null =>
  game.period && game.clock ? `Q${game.period} · ${game.clock}` : null;

export const hasScore = (game: Game): boolean =>
  typeof game.homeScore === 'number' && typeof game.awayScore === 'number';

export type Winner = 'home' | 'away' | null;

export const winnerOf = (game: Game): Winner => {
  if (game.status !== 'final' || !hasScore(game)) return null;
  if (game.homeScore! === game.awayScore!) return null;
  return game.homeScore! > game.awayScore! ? 'home' : 'away';
};

export const statusLabel = (status: Game['status']): string =>
  ({ scheduled: 'Scheduled', live: 'Live', final: 'Final' }[status]);
