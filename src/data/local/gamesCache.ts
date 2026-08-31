import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GamesPayload } from '../../types/game';

const CACHE_KEY = '@nba-matchup/games-cache/v1';

export interface CachedGames {
  payload: GamesPayload;
  cachedAt: string;
}

export const gamesCache = {
  async read(): Promise<CachedGames | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      return raw ? (JSON.parse(raw) as CachedGames) : null;
    } catch {

      return null;
    }
  },

  async write(payload: GamesPayload): Promise<void> {
    const entry: CachedGames = { payload, cachedAt: new Date().toISOString() };
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {

    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
  },
};
