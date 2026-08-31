import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { Game, Team } from '../types/game';
import { formatClock, formatGameTime, formatRecord, hasScore, winnerOf } from '../utils/formatters';
import { FavoriteButton } from './FavoriteButton';
import { StatusBadge } from './StatusBadge';
import { TeamMonogram } from './TeamMonogram';

interface Props {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export const GameCard = ({ game, isFavorite, onToggleFavorite, onPress }: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();
  const winner = winnerOf(game);
  const showScore = hasScore(game);

  const renderTeam = (team: Team, side: 'home' | 'away', score?: number) => {
    const dimmed = winner !== null && winner !== side;

    return (
      <View style={styles.teamRow}>
        <TeamMonogram teamId={team.id} abbreviation={team.abbreviation} size={36} />
        <View style={styles.teamText}>
          <Text
            numberOfLines={1}
            style={{
              color: dimmed ? colors.textMuted : colors.text,
              fontSize: fontSize.subtitle,
              fontFamily: winner === side ? fontFamily.semibold : fontFamily.medium,
            }}
          >
            {team.name}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fontSize.caption,
              fontFamily: fontFamily.regular,
            }}
          >
            {team.abbreviation} · {formatRecord(team.record)}
          </Text>
        </View>
        {showScore ? (
          <Text
            style={[
              styles.score,
              {
                color: dimmed ? colors.textMuted : colors.text,
                fontSize: fontSize.title,
                fontFamily: fontFamily.bold,
              },
            ]}
          >
            {score}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={game.awayTeam.name + ' at ' + game.homeTeam.name}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.lg,
          gap: spacing.md,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <StatusBadge status={game.status} detail={formatClock(game)} />
        <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
      </View>

      <View style={{ gap: spacing.sm }}>
        {renderTeam(game.awayTeam, 'away', game.awayScore)}
        {renderTeam(game.homeTeam, 'home', game.homeScore)}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, paddingTop: spacing.sm }]}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.textMuted,
            fontSize: fontSize.caption,
            fontFamily: fontFamily.regular,
          }}
        >
          {formatGameTime(game.scheduledAt)} · {game.venue}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamText: {
    flex: 1,
    gap: 2,
  },
  score: {
    fontVariant: ['tabular-nums'],
    minWidth: 44,
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
