import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  tone?: 'neutral' | 'danger';
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onAction?: () => void;
}

export const MessageState = ({
  icon,
  title,
  description,
  tone = 'neutral',
  actionLabel,
  actionIcon = 'refresh',
  onAction,
}: Props) => {
  const { colors, radii, spacing, fontSize, fontFamily } = useTheme();
  const accent = tone === 'danger' ? colors.danger : colors.textMuted;
  const accentSoft = tone === 'danger' ? colors.dangerSoft : colors.surfaceAlt;

  return (
    <View style={[styles.container, { padding: spacing.xl, gap: spacing.md }]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: accentSoft, borderRadius: radii.pill, padding: spacing.lg },
        ]}
      >
        <Ionicons name={icon} size={28} color={accent} />
      </View>

      <View style={{ gap: spacing.xs, alignItems: 'center' }}>
        <Text
          style={{
            color: colors.text,
            fontSize: fontSize.subtitle,
            fontFamily: fontFamily.semibold,
          }}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.description,
            { color: colors.textMuted, fontSize: fontSize.body, fontFamily: fontFamily.regular },
          ]}
        >
          {description}
        </Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: colors.accent,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              opacity: pressed ? 0.8 : 1,
              gap: spacing.sm,
            },
          ]}
        >
          <Ionicons name={actionIcon} size={16} color="#FFFFFF" />
          <Text
            style={{ color: '#FFFFFF', fontSize: fontSize.body, fontFamily: fontFamily.semibold }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
