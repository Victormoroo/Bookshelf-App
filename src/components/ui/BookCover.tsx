/**
 * Placeholder book cover — a diagonal gradient with the title set in the
 * bottom-left, mirroring the prototype. Real cover images will replace the
 * gradient when the books API is wired up.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { fonts } from '@/theme';
import {
  coverGradient,
  coverGradientEnd,
  coverGradientLocations,
  coverGradientStart,
} from '@/utils/cover';
import { AppText } from './AppText';

interface BookCoverProps {
  title: string;
  color: string;
  /** Cover width; height derives from the 2:3 ratio unless `height` is given. */
  width?: number;
  height?: number;
  borderRadius?: number;
  titleSize?: number;
  /** Hide the title text (e.g. tiny covers in list rows). */
  showTitle?: boolean;
  style?: ViewStyle;
}

export function BookCover({
  title,
  color,
  width,
  height,
  borderRadius = 6,
  titleSize = 11,
  showTitle = true,
  style,
}: BookCoverProps) {
  const resolvedHeight = height ?? (width ? width * 1.5 : undefined);

  return (
    <LinearGradient
      colors={coverGradient(color)}
      locations={coverGradientLocations}
      start={coverGradientStart}
      end={coverGradientEnd}
      style={[
        styles.cover,
        {
          width,
          height: resolvedHeight,
          aspectRatio: width || height ? undefined : 2 / 3,
          borderRadius,
          padding: Math.max(6, titleSize * 0.7),
        },
        style,
      ]}
    >
      {showTitle && (
        <AppText
          numberOfLines={4}
          color="rgba(255,255,255,0.94)"
          style={{
            fontFamily: fonts.displayRegular,
            fontSize: titleSize,
            lineHeight: titleSize * 1.12,
          }}
        >
          {title}
        </AppText>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});
