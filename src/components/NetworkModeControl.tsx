import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { networkConfig, type NetworkMode } from '../data/remote/networkConfig';
import { useGames } from '../state/GamesProvider';
import { useTheme } from '../theme/ThemeProvider';

const MODES: Array<{
  key: NetworkMode;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = [
  { key: 'online', label: 'Online', icon: 'cloud-done-outline' },
  { key: 'offline', label: 'Fail', icon: 'cloud-offline-outline' },
  { key: 'empty', label: 'Empty', icon: 'file-tray-outline' },
];

export const NetworkModeControl = () => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();
  const { refresh } = useGames();
  const [mode, setMode] = useState<NetworkMode>(networkConfig.getMode());

  const select = (next: NetworkMode) => {
    networkConfig.setMode(next);
    setMode(next);
    void refresh();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, padding: 3 },
      ]}
    >
      {MODES.map((option) => {
        const active = option.key === mode;
        return (
          <Pressable
            key={option.key}
            onPress={() => select(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={'Simulate ' + option.label + ' response'}
            style={[
              styles.option,
              {
                backgroundColor: active ? colors.surface : 'transparent',
                borderRadius: radii.pill,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs + 1,
                gap: 4,
              },
            ]}
          >
            <Ionicons
              name={option.icon}
              size={13}
              color={active ? colors.text : colors.textMuted}
            />
            <Text
              style={{
                color: active ? colors.text : colors.textMuted,
                fontSize: fontSize.caption - 1,
                fontFamily: active ? fontFamily.semibold : fontFamily.medium,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
