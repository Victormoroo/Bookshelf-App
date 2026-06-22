/**
 * Star rating — 5 stars, amber when filled. Read-only or interactive.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '@/theme';
import { AppText } from './AppText';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  emptyColor?: string;
}

export function StarRating({
  value,
  onChange,
  size = 26,
  emptyColor = '#D8CFBE',
}: StarRatingProps) {
  const interactive = !!onChange;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <AppText
            style={{ fontSize: size, lineHeight: size * 1.05 }}
            color={filled ? palette.accent : emptyColor}
          >
            ★
          </AppText>
        );
        return interactive ? (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
            onPress={() => onChange?.(n)}
            hitSlop={4}
          >
            {star}
          </Pressable>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
