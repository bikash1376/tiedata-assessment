import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { Player } from '../types/game';

interface Props {
  player: Player;
  accent: string;
}

const STATS: Array<{ key: keyof Player; label: string; suffix?: string }> = [
  { key: 'pointsPerGame', label: 'PPG' },
  { key: 'reboundsPerGame', label: 'RPG' },
  { key: 'assistsPerGame', label: 'APG' },
  { key: 'fieldGoalPercentage', label: 'FG', suffix: '%' },
  { key: 'threePointPercentage', label: '3P', suffix: '%' },
];

export const PlayerStatCard = ({ player, accent }: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: radii.md,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: accent, borderRadius: radii.pill }]} />
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: colors.text,
            fontSize: fontSize.body,
            fontFamily: fontFamily.semibold,
          }}
        >
          {player.name}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.caption,
            fontFamily: fontFamily.medium,
          }}
        >
          {player.position}
        </Text>
      </View>

      <View style={styles.statRow}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text
              style={[
                styles.statValue,
                { color: colors.text, fontSize: fontSize.body, fontFamily: fontFamily.semibold },
              ]}
            >
              {(player[stat.key] as number).toFixed(1)}
              {stat.suffix ?? ''}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 10,
                fontFamily: fontFamily.regular,
              }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    gap: 2,
    minWidth: 44,
  },
  statValue: {
    fontVariant: ['tabular-nums'],
  },
});
