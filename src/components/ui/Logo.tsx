/**
 * Brand logo — the rounded petrol tile with three book spines from the Design
 * System header. `size` scales the whole mark.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, statusColor } from '@/theme';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 60 }: LogoProps) {
  const unit = size / 60;
  const barWidth = 7 * unit;
  const bars = [
    { height: 24 * unit, color: '#EDE6D6' },
    { height: 34 * unit, color: statusColor.want },
    { height: 19 * unit, color: palette.accent, tilt: 9 },
  ];

  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: 15 * unit,
          paddingHorizontal: 11 * unit,
          paddingBottom: 12 * unit,
          gap: 4 * unit,
        },
      ]}
    >
      {bars.map((bar, i) => (
        <View
          key={i}
          style={{
            width: barWidth,
            height: bar.height,
            backgroundColor: bar.color,
            borderTopLeftRadius: 2 * unit,
            borderTopRightRadius: 2 * unit,
            transform: bar.tilt ? [{ rotate: `${bar.tilt}deg` }] : undefined,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: palette.primary,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
