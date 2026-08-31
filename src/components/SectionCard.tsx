import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const SectionCard = ({ title, children }: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: fontSize.caption,
          fontFamily: fontFamily.semibold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.lg,
            gap: spacing.lg,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
