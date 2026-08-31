import fixture from '../assets/data/sample_nba_data.json';
import { createGamesRepository } from '../src/data/repositories/gamesRepository';
import { gamesCache } from '../src/data/local/gamesCache';
import { NetworkError } from '../src/data/remote/errors';

describe('gamesRepository', () => {
  beforeEach(async () => {
    await gamesCache.clear();
  });

  it('returns parsed games from the network and writes them to the cache', async () => {
    const remote = { fetchGames: jest.fn().mockResolvedValue(fixture) };
    const repository = createGamesRepository({ remote });

    const result = await repository.getGames();

    expect(result.origin).toBe('network');
    expect(result.payload.games).toHaveLength(3);
    await expect(gamesCache.read()).resolves.toMatchObject({
      payload: { games: expect.any(Array) },
    });
  });

  // The offline requirement: a failed request must fall back to the last good
  // payload rather than wiping the screen.
  it('falls back to cached games when the network fails', async () => {
    const remote = {
      fetchGames: jest
        .fn()
        .mockResolvedValueOnce(fixture)
        .mockRejectedValueOnce(new NetworkError()),
    };
    const repository = createGamesRepository({ remote });

    await repository.getGames();
    const result = await repository.getGames();

    expect(result.origin).toBe('cache');
    expect(result.payload.games).toHaveLength(3);
    expect(result.cachedAt).toEqual(expect.any(String));
  });

  // With nothing cached there is nothing to show, so the error must surface and
  // drive the retry state instead of being swallowed into an empty list.
  it('rethrows when the network fails and no cache exists', async () => {
    const remote = { fetchGames: jest.fn().mockRejectedValue(new NetworkError('offline')) };
    const repository = createGamesRepository({ remote });

    await expect(repository.getGames()).rejects.toThrow('offline');
  });

  it('recovers to the network after a failed attempt', async () => {
    const remote = {
      fetchGames: jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValueOnce(fixture),
    };
    const repository = createGamesRepository({ remote });

    await expect(repository.getGames()).rejects.toThrow(NetworkError);
    const result = await repository.getGames();

    expect(result.origin).toBe('network');
  });

  it('surfaces an empty payload as an empty game list', async () => {
    const remote = { fetchGames: jest.fn().mockResolvedValue({ ...fixture, games: [] }) };
    const repository = createGamesRepository({ remote });

    const result = await repository.getGames();

    expect(result.payload.games).toEqual([]);
  });
});
