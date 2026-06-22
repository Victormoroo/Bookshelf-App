/**
 * Theme context — holds the current light/dark mode and exposes the resolved
 * surface palette. Mode is kept in local React state only (no persistence yet).
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

import { palettes, type ThemePalette } from './tokens';
import type { ThemeMode } from '@/types';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemePalette;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: palettes[mode],
      setMode,
      toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
