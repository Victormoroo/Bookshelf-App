/**
 * Status badge — small pill showing a shelf status with its brand color
 * (Design System, Components / 06).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, statusMeta } from '@/theme';
import type { BookStatus } from '@/types';
import { AppText } from './AppText';

interface StatusBadgeProps {
  status: BookStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const meta = statusMeta[status];
  const fontSize = size === 'sm' ? 10.5 : 12;
  const padV = size === 'sm' ? 4 : 6;
  const padH = size === 'sm' ? 9 : 13;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: meta.color, paddingVertical: padV, paddingHorizontal: padH },
      ]}
    >
      <AppText
        color={meta.darkText ? '#15302E' : '#FFFFFF'}
        style={{ fontFamily: fonts.bodySemiBold, fontSize }}
      >
        {meta.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});
