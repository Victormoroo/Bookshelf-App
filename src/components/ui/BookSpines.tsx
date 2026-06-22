/**
 * Brand mark — a small cluster of colored book spines, one tilted. Used in the
 * onboarding hero and empty states (Design System / Brand).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, statusColor } from '@/theme';

interface Spine {
  height: number;
  color: string;
  tilt?: number;
}

const HERO: Spine[] = [
  { height: 70, color: palette.primary },
  { height: 104, color: palette.primaryMuted },
  { height: 58, color: palette.accent, tilt: 10 },
  { height: 86, color: palette.primarySoft },
];

const SMALL: Spine[] = [
  { height: 28, color: statusColor.want },
  { height: 42, color: palette.primaryMuted },
  { height: 24, color: palette.accent, tilt: 8 },
];

interface BookSpinesProps {
  variant?: 'hero' | 'small';
}

export function BookSpines({ variant = 'small' }: BookSpinesProps) {
  const spines = variant === 'hero' ? HERO : SMALL;
  const width = variant === 'hero' ? 20 : 11;
  const gap = variant === 'hero' ? 9 : 5;

  return (
    <View style={[styles.row, { gap }]}>
      {spines.map((spine, i) => (
        <View
          key={i}
          style={{
            width,
            height: spine.height,
            backgroundColor: spine.color,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            transform: spine.tilt ? [{ rotate: `${spine.tilt}deg` }] : undefined,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
