import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { gamesRepository, type GamesRepository } from '../data/repositories/gamesRepository';
import type { Game } from '../types/game';
import { initialGamesState, type GamesState } from './gamesState';

interface GamesContextValue {
  state: GamesState;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  findGame: (gameId: string) => Game | undefined;
}

const GamesContext = createContext<GamesContextValue | undefined>(undefined);

interface ProviderProps {
  children: React.ReactNode;
  repository?: GamesRepository;
}

export const GamesProvider = ({ children, repository = gamesRepository }: ProviderProps) => {
  const [state, setState] = useState<GamesState>(initialGamesState);

  const fetchGames = useCallback(
    async (mode: 'initial' | 'refresh') => {
      setState((current) =>
        mode === 'refresh' && (current.status === 'success' || current.status === 'refreshing')
          ? { ...current, status: 'refreshing' }
          : { status: 'loading' }
      );

      try {
        const { payload, origin, cachedAt } = await repository.getGames();
        setState(
          payload.games.length === 0
            ? { status: 'empty', origin }
            : { status: 'success', games: payload.games, origin, cachedAt }
        );
      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Something went wrong.',
        });
      }
    },
    [repository]
  );

  const load = useCallback(() => fetchGames('initial'), [fetchGames]);
  const refresh = useCallback(() => fetchGames('refresh'), [fetchGames]);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<GamesContextValue>(
    () => ({
      state,
      load,
      refresh,
      findGame: (gameId: string) =>
        state.status === 'success' || state.status === 'refreshing'
          ? state.games.find((game) => game.id === gameId)
          : undefined,
    }),
    [state, load, refresh]
  );

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
};

export const useGames = (): GamesContextValue => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGames must be used inside a GamesProvider');
  }
  return context;
};
