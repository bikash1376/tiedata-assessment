import React from 'react';
import { StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { barFractions, leaderFor, type ComparisonMetric } from '../utils/comparison';
import { teamColor } from '../utils/teamColor';

interface Props {
  metric: ComparisonMetric;
  homeTeamId: string;
  awayTeamId: string;
  homeValue: number;
  awayValue: number;
}

export const ComparisonBar = ({
  metric,
  homeTeamId,
  awayTeamId,
  homeValue,
  awayValue,
}: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();
  const fractions = barFractions(metric, homeValue, awayValue);
  const leader = leaderFor(metric, homeValue, awayValue);

  const renderBar = (side: 'home' | 'away', teamId: string, value: number, fraction: number) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.value,
          {
            color: leader === side ? colors.text : colors.textMuted,
            fontSize: fontSize.body,
            fontFamily: leader === side ? fontFamily.semibold : fontFamily.regular,
          },
        ]}
      >
        {value.toFixed(1)}
      </Text>
      <View
        style={[
          styles.track,
          { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill },
        ]}
      >
        <View
          style={{
            width: ((fraction * 100).toFixed(2) + '%') as DimensionValue,
            height: '100%',
            borderRadius: radii.pill,
            backgroundColor: teamColor(teamId),
            opacity: leader === null || leader === side ? 1 : 0.45,
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.labelRow}>
        <Text
          style={{ color: colors.text, fontSize: fontSize.body, fontFamily: fontFamily.medium }}
        >
          {metric.label}
        </Text>
        {metric.lowerIsBetter ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fontSize.caption,
              fontFamily: fontFamily.regular,
            }}
          >
            lower is better
          </Text>
        ) : null}
      </View>
      {renderBar('away', awayTeamId, awayValue, fractions.away)}
      {renderBar('home', homeTeamId, homeValue, fractions.home)}
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  value: {
    width: 52,
    fontVariant: ['tabular-nums'],
  },
  track: {
    flex: 1,
    height: 10,
    overflow: 'hidden',
  },
});
