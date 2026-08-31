import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComparisonBar } from '../components/ComparisonBar';
import { PlayerStatCard } from '../components/PlayerStatCard';
import { SectionCard } from '../components/SectionCard';
import { TeamMonogram } from '../components/TeamMonogram';
import { FavoriteButton } from '../components/FavoriteButton';
import { StatusBadge } from '../components/StatusBadge';
import { MessageState } from '../components/states/MessageState';
import { useFavorites } from '../state/FavoritesProvider';
import { useGames } from '../state/GamesProvider';
import { useTheme } from '../theme/ThemeProvider';
import type { RootStackParamList } from '../navigation/types';
import type { Team } from '../types/game';
import { COMPARISON_METRICS, metricValue } from '../utils/comparison';
import { formatClock, formatGameTime, formatRecord, hasScore } from '../utils/formatters';
import { teamColor } from '../utils/teamColor';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchupDetails'>;

export const MatchupDetailsScreen = ({ route, navigation }: Props) => {
  const { colors, spacing, fontSize, fontFamily } = useTheme();
  const insets = useSafeAreaInsets();
  const { findGame } = useGames();
  const { isFavorite, toggleFavorite } = useFavorites();

  const game = findGame(route.params.gameId);

  if (!game) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <MessageState
          icon="help-circle-outline"
          title="Game unavailable"
          description="This matchup is no longer in the loaded data set."
          actionLabel="Go back"
          actionIcon="arrow-back"
          onAction={navigation.goBack}
        />
      </View>
    );
  }

  const renderRecord = (team: Team, alignment: 'flex-start' | 'flex-end') => (
    <View style={{ alignItems: alignment, gap: spacing.xs, flex: 1 }}>
      <TeamMonogram teamId={team.id} abbreviation={team.abbreviation} size={52} />
      <Text
        numberOfLines={2}
        style={{
          color: colors.text,
          fontSize: fontSize.body,
          fontFamily: fontFamily.semibold,
          textAlign: alignment === 'flex-end' ? 'right' : 'left',
        }}
      >
        {team.name}
      </Text>
      <Text
        style={{ color: colors.textMuted, fontSize: fontSize.caption, fontFamily: fontFamily.regular }}
      >
        {formatRecord(team.record)}
      </Text>
    </View>
  );

  const renderRoster = (team: Team) => (
    <View style={{ gap: spacing.sm, flex: 1 }}>
      <View style={styles.rosterHeader}>
        <TeamMonogram teamId={team.id} abbreviation={team.abbreviation} size={24} />
        <Text
          numberOfLines={1}
          style={{ color: colors.text, fontSize: fontSize.body, fontFamily: fontFamily.semibold }}
        >
          {team.name}
        </Text>
      </View>
      {team.keyPlayers.length === 0 ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.caption,
            fontFamily: fontFamily.regular,
          }}
        >
          No player data available.
        </Text>
      ) : (
        team.keyPlayers.map((player) => (
          <PlayerStatCard key={player.id} player={player} accent={teamColor(team.id)} />
        ))
      )}
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
        gap: spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: spacing.md }}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={navigation.goBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back to games"
            style={{ padding: spacing.xs }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <StatusBadge status={game.status} detail={formatClock(game)} />
          <FavoriteButton
            active={isFavorite(game.id)}
            onPress={() => toggleFavorite(game.id)}
            size={26}
          />
        </View>

        <View style={styles.matchupRow}>
          {renderRecord(game.awayTeam, 'flex-start')}
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            {hasScore(game) ? (
              <Text
                style={[
                  styles.score,
                  { color: colors.text, fontSize: fontSize.display, fontFamily: fontFamily.bold },
                ]}
              >
                {game.awayScore} - {game.homeScore}
              </Text>
            ) : (
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: fontSize.subtitle,
                  fontFamily: fontFamily.medium,
                }}
              >
                at
              </Text>
            )}
          </View>
          {renderRecord(game.homeTeam, 'flex-end')}
        </View>

        <Text
          style={[
            styles.meta,
            { color: colors.textMuted, fontSize: fontSize.caption, fontFamily: fontFamily.regular },
          ]}
        >
          {formatGameTime(game.scheduledAt)} · {game.venue}
        </Text>
      </View>

      <SectionCard title="Team comparison">
        {COMPARISON_METRICS.map((metric) => (
          <ComparisonBar
            key={metric.key}
            metric={metric}
            homeTeamId={game.homeTeam.id}
            awayTeamId={game.awayTeam.id}
            homeValue={metricValue(game.homeTeam, metric.key)}
            awayValue={metricValue(game.awayTeam, metric.key)}
          />
        ))}
      </SectionCard>

      <SectionCard title="Key players">
        {renderRoster(game.awayTeam)}
        {renderRoster(game.homeTeam)}
      </SectionCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  matchupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rosterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  score: {
    fontVariant: ['tabular-nums'],
  },
  meta: {
    textAlign: 'center',
  },
});
