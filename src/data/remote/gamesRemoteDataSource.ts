import rawData from '../../../assets/data/sample_nba_data.json';
import { NetworkError } from './errors';
import { NETWORK_DELAY_MS, networkConfig } from './networkConfig';

export interface GamesRemoteDataSource {
  fetchGames(): Promise<unknown>;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomLatency = () =>
  NETWORK_DELAY_MS.min + Math.random() * (NETWORK_DELAY_MS.max - NETWORK_DELAY_MS.min);

export const createSimulatedRemoteDataSource = (
  latencyMs: () => number = randomLatency
): GamesRemoteDataSource => ({
  async fetchGames() {
    await delay(latencyMs());

    if (networkConfig.isOffline()) {
      throw new NetworkError('Simulated network failure.');
    }
    if (networkConfig.isEmpty()) {
      return { ...(rawData as object), games: [] };
    }
    return rawData;
  },
});
