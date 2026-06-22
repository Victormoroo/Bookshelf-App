/**
 * Progress bar — amber fill on a track (Design System, Components / 08).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, useTheme } from '@/theme';

interface ProgressBarProps {
  /** 0–100. */
  percent: number;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ percent, height = 6, trackColor }: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor ?? colors.border },
      ]}
    >
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, height, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: palette.accent,
  },
});
