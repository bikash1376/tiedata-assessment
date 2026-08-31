import type { Game } from '../types/game';
import type { GamesOrigin } from '../data/repositories/gamesRepository';

export type GamesState =
  | { status: 'loading' }
  | { status: 'refreshing'; games: Game[]; origin: GamesOrigin; cachedAt?: string }
  | { status: 'success'; games: Game[]; origin: GamesOrigin; cachedAt?: string }
  | { status: 'empty'; origin: GamesOrigin }
  | { status: 'error'; message: string };

export const initialGamesState: GamesState = { status: 'loading' };

export const gamesOf = (state: GamesState): Game[] =>
  state.status === 'success' || state.status === 'refreshing' ? state.games : [];

export const isStale = (state: GamesState): boolean =>
  (state.status === 'success' || state.status === 'refreshing') && state.origin === 'cache';
