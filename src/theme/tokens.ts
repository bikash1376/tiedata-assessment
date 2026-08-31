export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  display: 28,
} as const;

export interface Colors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  live: string;
  liveSoft: string;
  final: string;
  finalSoft: string;
  scheduled: string;
  scheduledSoft: string;
  favorite: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
}

const palette: Record<'light' | 'dark', Colors> = {
  light: {
    background: '#F6F6F7',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEFF2',
    border: '#E2E2E7',
    text: '#0B0B0F',
    textMuted: '#6B6B76',
    accent: '#2563EB',
    accentSoft: '#DBEAFE',
    live: '#DC2626',
    liveSoft: '#FEE2E2',
    final: '#6B6B76',
    finalSoft: '#EFEFF2',
    scheduled: '#0891B2',
    scheduledSoft: '#CFFAFE',
    favorite: '#F59E0B',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
  },
  dark: {
    background: '#0B0B0F',
    surface: '#16161C',
    surfaceAlt: '#202029',
    border: '#2A2A34',
    text: '#F5F5F7',
    textMuted: '#9A9AA6',
    accent: '#60A5FA',
    accentSoft: '#1E293B',
    live: '#F87171',
    liveSoft: '#3B1418',
    final: '#9A9AA6',
    finalSoft: '#202029',
    scheduled: '#22D3EE',
    scheduledSoft: '#0E2F36',
    favorite: '#FBBF24',
    danger: '#F87171',
    dangerSoft: '#3B1418',
    warning: '#FCD34D',
    warningSoft: '#3A2E0B',
  },
};

export type ColorScheme = keyof typeof palette;

export const getColors = (scheme: ColorScheme | null | undefined): Colors =>
  palette[scheme === 'dark' ? 'dark' : 'light'];

export const teamAccents = [
  '#7C3AED',
  '#0891B2',
  '#DB2777',
  '#059669',
  '#EA580C',
  '#2563EB',
  '#CA8A04',
  '#DC2626',
] as const;
