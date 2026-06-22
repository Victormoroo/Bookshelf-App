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

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: palette.primary }}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
      <AppText
        color={palette.onPrimary}
        style={{ fontFamily: fonts.display, fontSize: size * 0.42 }}
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
