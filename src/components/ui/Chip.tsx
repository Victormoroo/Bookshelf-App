/**
 * Chip — pill used for suggestions and the detail-screen status selector
 * (Design System, Components / 06). Supports a selected/active state with a
 * custom fill color (used by the status selector).
 */
import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { fonts, palette, radius, useTheme } from '@/theme';
import { AppText } from './AppText';

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  /** Fill color when selected (defaults to primary). */
  activeColor?: string;
  /** Use dark ink for the active label (light fills like "Quero ler"). */
  activeDarkText?: boolean;
  style?: ViewStyle;
}

export function Chip({
  label,
  onPress,
  selected = false,
  activeColor = palette.primary,
  activeDarkText = false,
  style,
}: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? activeColor : colors.surface,
          borderColor: selected ? activeColor : colors.border,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <AppText
        color={selected ? (activeDarkText ? '#15302E' : '#FFFFFF') : colors.textSecondary}
        style={styles.label}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
});
