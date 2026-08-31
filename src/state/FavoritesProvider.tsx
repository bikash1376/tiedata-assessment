import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { favoritesStore } from '../data/local/favoritesStore';

interface FavoritesContextValue {
  favorites: Set<string>;
  isFavorite: (gameId: string) => boolean;
  toggleFavorite: (gameId: string) => void;
  hydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    favoritesStore.read().then((stored) => {
      if (!active) return;
      setFavorites(stored);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback((gameId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      void favoritesStore.write(next);
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      hydrated,
      isFavorite: (gameId: string) => favorites.has(gameId),
      toggleFavorite,
    }),
    [favorites, hydrated, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside a FavoritesProvider');
  }
  return context;
};
