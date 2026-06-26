/**
 * Avatar — shows the user's photo when available, otherwise the initial letter
 * on the brand petrol background.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { fonts, palette } from '@/theme';
import { AppText } from './AppText';

interface AvatarProps {
  name?: string | null;
  uri?: string | null;
  size?: number;
}

export function Avatar({ name, uri, size = 58 }: AvatarProps) {
  const letter = (name?.trim().charAt(0) || '?').toUpperCase();
  const radius = size / 2;
  const fontSize = size * 0.42;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        // Decode at display size — fast/cheap when the source is a large photo.
        resizeMethod="resize"
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: palette.primary }}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
      <AppText
        color={palette.onPrimary}
        // Proportional line height (instead of the inherited body line height) so
        // the glyph renders identically at any avatar size.
        style={{
          fontFamily: fonts.display,
          fontSize,
          lineHeight: fontSize * 1.2,
          includeFontPadding: false,
          textAlign: 'center',
        }}
      >
        {letter}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
