import AsyncStorage from '@react-native-async-storage/async-storage';
import { favoritesStore } from '../src/data/local/favoritesStore';

const KEY = '@nba-matchup/favorites/v1';

describe('favoritesStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns an empty set when nothing has been saved', async () => {
    await expect(favoritesStore.read()).resolves.toEqual(new Set());
  });

  // This is the restart requirement: what write() persists must come back on a
  // cold read, with no in-memory state carried over.
  it('round-trips favorites through storage', async () => {
    await favoritesStore.write(new Set(['nba-sample-001', 'nba-sample-003']));

    const restored = await favoritesStore.read();

    expect(restored.has('nba-sample-001')).toBe(true);
    expect(restored.has('nba-sample-003')).toBe(true);
    expect(restored.size).toBe(2);
  });

  it('persists removals', async () => {
    await favoritesStore.write(new Set(['nba-sample-001', 'nba-sample-002']));
    await favoritesStore.write(new Set(['nba-sample-002']));

    await expect(favoritesStore.read()).resolves.toEqual(new Set(['nba-sample-002']));
  });

  // A malformed value should degrade to "no favorites" rather than crash the
  // app on launch, since read() runs during the first render.
  it('ignores a corrupt stored value', async () => {
    await AsyncStorage.setItem(KEY, 'not json');

    await expect(favoritesStore.read()).resolves.toEqual(new Set());
  });

  it('discards non-string entries', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(['nba-sample-001', 42, null]));

    await expect(favoritesStore.read()).resolves.toEqual(new Set(['nba-sample-001']));
  });
});
