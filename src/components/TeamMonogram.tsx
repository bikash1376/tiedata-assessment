import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { teamColor } from '../utils/teamColor';

interface Props {
  teamId: string;
  abbreviation: string;
  size?: number;
}

export const TeamMonogram = ({ teamId, abbreviation, size = 40 }: Props) => {
  const { radii, fontFamily } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          backgroundColor: teamColor(teamId),
        },
      ]}
    >
      <Text style={[styles.label, { fontSize: size * 0.3, fontFamily: fontFamily.bold }]}>
        {abbreviation}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
