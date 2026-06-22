/**
 * Empty state — brand spines + warm headline + message + optional action.
 * "Never a dead screen" (Wireframes).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, space, useTheme } from '@/theme';
import { AppText } from './AppText';
import { BookSpines } from './BookSpines';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <BookSpines variant="small" />
      <AppText
        color={colors.text}
        style={{ fontFamily: fonts.display, fontSize: 18, textAlign: 'center' }}
      >
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <Button label={actionLabel} size="small" onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[4],
    paddingVertical: space[12],
    paddingHorizontal: space[6],
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
