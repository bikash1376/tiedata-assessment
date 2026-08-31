import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useFavorites } from '../state/FavoritesProvider';
import { useGames } from '../state/GamesProvider';
import { gamesOf, isStale } from '../state/gamesState';
import type { Game } from '../types/game';
import { GameCard } from './GameCard';
import { CacheBanner } from './states/CacheBanner';
import { LoadingState } from './states/LoadingState';
import { MessageState } from './states/MessageState';

interface Props {
  favoritesOnly?: boolean;
  onSelectGame: (gameId: string) => void;
}

export const GamesListView = ({ favoritesOnly = false, onSelectGame }: Props) => {
  const { colors, spacing } = useTheme();
  const { state, refresh, load } = useGames();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const allGames = gamesOf(state);
  const games = favoritesOnly ? allGames.filter((game) => favorites.has(game.id)) : allGames;
  const stale = isStale(state);
  const cachedAt = state.status === 'success' || state.status === 'refreshing' ? state.cachedAt : undefined;

  const renderItem = useCallback(
    ({ item }: { item: Game }) => (
      <GameCard
        game={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => onSelectGame(item.id)}
      />
    ),
    [isFavorite, toggleFavorite, onSelectGame]
  );

  if (state.status === 'loading') {
    return <LoadingState />;
  }

  if (state.status === 'error') {
    return (
      <MessageState
        icon="cloud-offline-outline"
        tone="danger"
        title="Could not load games"
        description={state.message + ' No cached data is available yet.'}
        actionLabel="Try again"
        onAction={load}
      />
    );
  }

  const emptyState =
    state.status === 'empty' ? (
      <MessageState
        icon="basketball-outline"
        title="No games scheduled"
        description="There are no games in the current window. Pull down to check again."
        actionLabel="Refresh"
        onAction={refresh}
      />
    ) : (
      <MessageState
        icon="star-outline"
        title="No favorites yet"
        description="Tap the star on any game to keep it here. Favorites survive a restart."
      />
    );

  return (
    <FlatList
      data={games}
      keyExtractor={(game) => game.id}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.content,
        { padding: spacing.lg, gap: spacing.md },
        games.length === 0 && styles.emptyContent,
      ]}
      ListHeaderComponent={stale ? <CacheBanner cachedAt={cachedAt} /> : null}
      ListEmptyComponent={emptyState}
      refreshControl={
        <RefreshControl
          refreshing={state.status === 'refreshing'}
          onRefresh={refresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  emptyContent: {
    justifyContent: 'center',
  },
});
