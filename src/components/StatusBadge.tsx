import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import type { GameStatus } from '../types/game';
import { statusLabel } from '../utils/formatters';

interface Props {
  status: GameStatus;
  detail?: string | null;
}

const TONE_ICON = {
  scheduled: 'time-outline',
  live: 'radio-outline',
  final: 'checkmark-done-outline',
} as const;

export const StatusBadge = ({ status, detail }: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();

  const tone = {
    scheduled: { fg: colors.scheduled, bg: colors.scheduledSoft },
    live: { fg: colors.live, bg: colors.liveSoft },
    final: { fg: colors.final, bg: colors.finalSoft },
  }[status];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tone.bg,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
          gap: spacing.xs,
        },
      ]}
    >
      <Ionicons name={TONE_ICON[status]} size={12} color={tone.fg} />
      <Text style={{ color: tone.fg, fontSize: fontSize.caption, fontFamily: fontFamily.semibold }}>
        {detail ?? statusLabel(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});
