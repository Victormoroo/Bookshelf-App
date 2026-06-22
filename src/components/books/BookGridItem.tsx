/**
 * Grid item — a cover with the author beneath it (Home shelf grid).
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BookCover } from '@/components/ui/BookCover';
import { elevation, useTheme } from '@/theme';
import type { ShelvedBook } from '@/types';

interface BookGridItemProps {
  book: ShelvedBook;
  onPress: () => void;
}

export function BookGridItem({ book, onPress }: BookGridItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={elevation[1]}>
        <BookCover title={book.title} color={book.color} titleSize={11} borderRadius={6} />
      </View>
      <AppText
        variant="caption"
        color={colors.textSecondary}
        numberOfLines={1}
        style={styles.author}
      >
        {book.author}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  author: {
    fontSize: 11,
    marginTop: 6,
  },
});
