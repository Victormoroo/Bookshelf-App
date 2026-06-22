/**
 * Button — variants and sizes from the Design System (Components / 04).
 * One primary action per screen; min height ≈ 48px.
 */
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { fonts, palette, radius, useTheme } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const sizeStyles: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number; radius: number }> = {
  small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12, radius: 8 },
  medium: { paddingVertical: 13, paddingHorizontal: 24, fontSize: 14, radius: radius.md },
  large: { paddingVertical: 16, paddingHorizontal: 30, fontSize: 15, radius: 12 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const s = sizeStyles[size];

  const palettes: Record<Variant, { bg: string; border?: string; text: string }> = {
    primary: { bg: palette.primary, text: palette.onPrimary },
    secondary: { bg: colors.surfaceAlt, border: '#D4E3E5', text: palette.primary },
    ghost: { bg: 'transparent', text: palette.primary },
    destructive: { bg: 'transparent', border: '#E3C4BC', text: palette.error },
  };
  const v = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.radius,
          backgroundColor: disabled
            ? '#B7C2C0'
            : pressed && variant === 'primary'
              ? palette.primaryDark
              : v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          opacity: pressed && variant !== 'primary' ? 0.7 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          <AppText
            color={disabled ? palette.onPrimary : v.text}
            style={{ fontFamily: fonts.bodySemiBold, fontSize: s.fontSize }}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
