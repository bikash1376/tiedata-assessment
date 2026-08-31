import type { GamesPayload } from '../../types/game';
import { gamesCache } from '../local/gamesCache';
import { toGamesPayload } from '../mappers/gameMapper';
import { createSimulatedRemoteDataSource, type GamesRemoteDataSource } from '../remote/gamesRemoteDataSource';

export type GamesOrigin = 'network' | 'cache';

export interface GamesResult {
  payload: GamesPayload;
  origin: GamesOrigin;

  cachedAt?: string;
}

export interface GamesRepository {
  getGames(): Promise<GamesResult>;
}

interface Deps {
  remote?: GamesRemoteDataSource;
  cache?: typeof gamesCache;
}

export const createGamesRepository = ({
  remote = createSimulatedRemoteDataSource(),
  cache = gamesCache,
}: Deps = {}): GamesRepository => ({
  async getGames() {
    try {
      const raw = await remote.fetchGames();
      const payload = toGamesPayload(raw);
      await cache.write(payload);
      return { payload, origin: 'network' };
    } catch (error) {
      const cached = await cache.read();
      if (cached) {
        return { payload: cached.payload, origin: 'cache', cachedAt: cached.cachedAt };
      }
      throw error;
    }
  },
});

export const gamesRepository = createGamesRepository();
