/**
 * Stat card — big serif number + label, used in the profile stats grid.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { space, useTheme } from '@/theme';

interface StatCardProps {
  value: number | string;
  label: string;
  accent: string;
}

export function StatCard({ value, label, accent }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <AppText color={accent} style={styles.value}>
        {value}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
  },
  value: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 32,
    lineHeight: 34,
  },
  label: {
    fontSize: 12.5,
    marginTop: 6,
  },
});
