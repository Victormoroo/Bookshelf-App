/**
 * Theme context — holds the user's theme *preference* (light / dark / system)
 * and exposes the *resolved* palette. When the preference is "system" the
 * palette follows the OS color scheme. Kept in local state only (no persistence
 * yet).
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { palettes, type ThemePalette } from './tokens';
import type { ThemeMode, ThemePreference } from '@/types';

interface ThemeContextValue {
  /** What the user picked (light | dark | system). */
  preference: ThemePreference;
  /** The palette actually in use (system resolved to light/dark). */
  mode: ThemeMode;
  colors: ThemePalette;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('light');
  const systemScheme = useColorScheme();

  const mode: ThemeMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      mode,
      colors: palettes[mode],
      setPreference,
    }),
    [preference, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
