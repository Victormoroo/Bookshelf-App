/**
 * Search result row — small cover, title/author/year, and an add button or an
 * "on the shelf" marker (Search screen).
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BookCover } from '@/components/ui/BookCover';
import { fonts, palette, useTheme } from '@/theme';
import type { Book } from '@/types';

interface SearchResultRowProps {
  book: Book;
  inLibrary: boolean;
  onAdd: () => void;
}

export function SearchResultRow({ book, inLibrary, onAdd }: SearchResultRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <BookCover
        title={book.title}
        color={book.color}
        width={36}
        titleSize={7}
        borderRadius={4}
      />
      <View style={styles.info}>
        <AppText
          color={colors.text}
          numberOfLines={1}
          style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5 }}
        >
          {book.title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.meta}>
          {book.author} · {book.year}
        </AppText>
      </View>
      {inLibrary ? (
        <AppText
          color={palette.success}
          style={{ fontFamily: fonts.bodySemiBold, fontSize: 10.5 }}
        >
          ✓ Na estante
        </AppText>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${book.title}`}
          onPress={onAdd}
          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <AppText color={palette.onPrimary} style={styles.addGlyph}>
            +
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    fontSize: 11.5,
    marginTop: 2,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGlyph: {
    fontSize: 20,
    lineHeight: 22,
  },
});
