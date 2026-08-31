import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@nba-matchup/favorites/v1';

export const favoritesStore = {
  async read(): Promise<Set<string>> {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      if (!raw) return new Set();
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.filter((id): id is string => typeof id === 'string'));
    } catch {
      return new Set();
    }
  },

  async write(ids: Set<string>): Promise<void> {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  },
};
