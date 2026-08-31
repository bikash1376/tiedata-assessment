import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const PLACEHOLDERS = [0, 1, 2];

export const LoadingState = () => {
  const { colors, radii, spacing } = useTheme();

  return (
    <View style={{ padding: spacing.lg, gap: spacing.md }} accessibilityLabel="Loading games">
      {PLACEHOLDERS.map((key) => (
        <View
          key={key}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.lg,
              padding: spacing.lg,
              gap: spacing.md,
            },
          ]}
        >
          <View
            style={[
              styles.bar,
              { width: '30%', backgroundColor: colors.surfaceAlt, borderRadius: radii.pill },
            ]}
          />
          <View style={{ gap: spacing.sm }}>
            <View style={[styles.row, { backgroundColor: colors.surfaceAlt, borderRadius: radii.md }]} />
            <View style={[styles.row, { backgroundColor: colors.surfaceAlt, borderRadius: radii.md }]} />
          </View>
          <View
            style={[
              styles.bar,
              { width: '55%', backgroundColor: colors.surfaceAlt, borderRadius: radii.pill },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  bar: {
    height: 12,
  },
  row: {
    height: 36,
  },
});
