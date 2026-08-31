import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  active: boolean;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
}

export const FavoriteButton = ({ active, onPress, size = 22, accessibilityLabel }: Props) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={
        accessibilityLabel ?? (active ? 'Remove from favorites' : 'Add to favorites')
      }
      style={({ pressed }) => [
        styles.button,
        {
          borderRadius: radii.pill,
          padding: spacing.xs,
          backgroundColor: pressed ? colors.surfaceAlt : 'transparent',
        },
      ]}
    >
      <Ionicons
        name={active ? 'star' : 'star-outline'}
        size={size}
        color={active ? colors.favorite : colors.textMuted}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
