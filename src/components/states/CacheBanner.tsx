import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  cachedAt?: string;
}

export const CacheBanner = ({ cachedAt }: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();

  const when = cachedAt
    ? new Date(cachedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.warningSoft,
          borderRadius: radii.md,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
      <Text
        style={[
          styles.text,
          { color: colors.warning, fontSize: fontSize.caption, fontFamily: fontFamily.medium },
        ]}
      >
        Offline. Showing cached data{when ? ' from ' + when : ''}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});
