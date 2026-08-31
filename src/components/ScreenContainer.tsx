import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export const ScreenContainer = ({ title, subtitle, headerAction, children }: Props) => {
  const { colors, spacing, fontSize, fontFamily } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          gap: spacing.md,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: fontSize.display,
              fontFamily: fontFamily.bold,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fontSize.body,
                fontFamily: fontFamily.regular,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {headerAction}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
