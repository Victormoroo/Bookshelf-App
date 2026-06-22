/**
 * Typed text primitive. Picks font family / size / line-height from the type
 * scale (Design System) so screens never hardcode typography.
 */
import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { type, useTheme } from '@/theme';

type Variant = 'h1' | 'h2' | 'title' | 'body' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  /** Overrides the default themed color. */
  color?: string;
  weight?: TextStyle['fontWeight'];
}

export function AppText({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const base = type[variant];
  const defaultColor =
    variant === 'label' ? colors.textMuted : colors.text;

  return (
    <Text
      style={[base as TextStyle, { color: color ?? defaultColor }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const textStyles = StyleSheet.create({});
