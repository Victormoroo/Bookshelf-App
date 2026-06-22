/**
 * Design tokens — transcribed directly from the "Bookshelf Design System" doc.
 * Nothing visual should hardcode a hex/size; pull it from here (or the theme
 * palette returned by `useTheme`).
 */
import type { ThemeMode } from '@/types';

/** Brand + semantic colors — constant across light/dark. */
export const palette = {
  primary: '#114B5F',
  primaryDark: '#0C323F',
  primaryMuted: '#2E7C8C',
  primarySoft: '#9FC3CB',
  accent: '#C5872F',
  accentSoft: '#E8B566',

  success: '#3E7D54',
  warning: '#C5872F',
  error: '#B2452F',
  info: '#2E7C8C',

  /** On-brand text used on top of the petrol primary. */
  onPrimary: '#F4EFE6',
} as const;

/** Status (shelf) colors. */
export const statusColor = {
  own: '#2E7C8C',
  reading: '#C5872F',
  read: '#114B5F',
  want: '#9FC3CB',
} as const;

/** Surface palette — switches with the theme mode. */
export interface ThemePalette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  link: string;
}

const light: ThemePalette = {
  bg: '#F4EFE6',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF1F2',
  border: '#E6DECF',
  text: '#15302E',
  textSecondary: '#5A6766',
  textMuted: '#8A9491',
  link: '#114B5F',
};

const dark: ThemePalette = {
  bg: '#15211F',
  surface: '#1E2E2C',
  surfaceAlt: '#243431',
  border: '#2E3E3B',
  text: '#F1EEE7',
  textSecondary: '#AEBAB8',
  textMuted: '#7E8C89',
  link: '#7FB0BB',
};

export const palettes: Record<ThemeMode, ThemePalette> = { light, dark };

/** Spacing scale — base 4. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

/** Corner radius scale. */
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

/** Font family keys — must match the @expo-google-fonts weights we load. */
export const fonts = {
  display: 'Spectral_500Medium',
  displayRegular: 'Spectral_400Regular',
  displaySemiBold: 'Spectral_600SemiBold',
  body: 'PublicSans_400Regular',
  bodyMedium: 'PublicSans_500Medium',
  bodySemiBold: 'PublicSans_600SemiBold',
  bodyBold: 'PublicSans_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
} as const;

/** Type scale from the Design System (size / lineHeight). */
export const type = {
  h1: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  title: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.14 * 11,
    textTransform: 'uppercase' as const,
  },
} as const;

/** Elevation presets (iOS shadow + Android elevation). */
export const elevation = {
  1: {
    shadowColor: '#15302E',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  2: {
    shadowColor: '#15302E',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  3: {
    shadowColor: '#15302E',
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
  },
} as const;

/** Per-status display metadata. */
export const statusMeta = {
  own: { label: 'Tenho', color: statusColor.own, darkText: false },
  reading: { label: 'Lendo', color: statusColor.reading, darkText: false },
  read: { label: 'Lido', color: statusColor.read, darkText: false },
  want: { label: 'Quero ler', color: statusColor.want, darkText: true },
} as const;

/** Display order of the shelves (Design System). */
export const shelfOrder = ['own', 'reading', 'read', 'want'] as const;
