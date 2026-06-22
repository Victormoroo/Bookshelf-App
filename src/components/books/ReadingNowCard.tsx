/**
 * "Lendo agora" hero card on Home — current book with progress
 * (Design System, Components / 07; Wireframes Home · A ★).
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BookCover } from '@/components/ui/BookCover';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { elevation, fonts, palette, radius, space, useTheme } from '@/theme';
import type { ShelvedBook } from '@/types';

interface ReadingNowCardProps {
  book: ShelvedBook;
  onPress: () => void;
}

export function ReadingNowCard({ book, onPress }: ReadingNowCardProps) {
  const { colors } = useTheme();
  const percent = Math.round((book.currentPage / book.pages) * 100);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        elevation[1],
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.row}>
        <BookCover title={book.title} color={book.color} width={58} titleSize={9} borderRadius={5} />
        <View style={styles.info}>
          <AppText variant="label" color={palette.accent} style={styles.kicker}>
            Lendo agora
          </AppText>
          <AppText variant="title" color={colors.text} numberOfLines={2} style={styles.title}>
            {book.title}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {book.author}
          </AppText>
          <View style={styles.progress}>
            <ProgressBar percent={percent} height={5} />
          </View>
          <AppText
            color={colors.textMuted}
            style={{ fontFamily: fonts.mono, fontSize: 9, marginTop: 6 }}
          >
            {percent}% · {book.currentPage}/{book.pages}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: space[4],
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    fontSize: 8.5,
    letterSpacing: 0.12 * 8.5,
  },
  title: {
    marginTop: 4,
  },
  progress: {
    marginTop: 12,
  },
});
