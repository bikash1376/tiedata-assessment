import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { fontFamily } from './fonts';
import { fontSize, getColors, radii, spacing, type Colors } from './tokens';

interface Theme {
  colors: Colors;
  radii: typeof radii;
  spacing: typeof spacing;
  fontSize: typeof fontSize;
  fontFamily: typeof fontFamily;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();

  const theme = useMemo<Theme>(
    () => ({
      colors: getColors(scheme),
      radii,
      spacing,
      fontSize,
      fontFamily,
      isDark: scheme === 'dark',
    }),
    [scheme]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
};
