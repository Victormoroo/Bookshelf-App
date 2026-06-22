/**
 * Home (Estante) — greeting, "Lendo agora" hero, shelf tabs and a cover grid,
 * with a per-shelf empty state. Mirrors Wireframes Home · A ★.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BookGridItem, ReadingNowCard, ShelfTabs } from '@/components/books';
import { Screen } from '@/components/layout/Screen';
import { AppText, EmptyState } from '@/components/ui';
import { useLibrary } from '@/context/LibraryProvider';
import { palette, space, useTheme } from '@/theme';
import type { BookStatus, ShelvedBook } from '@/types';

const EMPTY_TITLES: Record<BookStatus, string> = {
  own: 'Nada por aqui ainda',
  reading: 'Nenhuma leitura em andamento',
  read: 'Você ainda não marcou leituras',
  want: 'Sua lista de desejos começa aqui',
};

const EMPTY_MESSAGES: Record<BookStatus, string> = {
  own: 'Adicione os livros que você possui.',
  reading: 'Marque um livro como "Lendo" para acompanhar o progresso.',
  read: 'Os livros que você terminar aparecem aqui.',
  want: 'Guarde os livros que pretende ler. Sem pressa.',
};

/** Split into rows of 3, padding the last row so covers keep their size. */
function toRows(books: ShelvedBook[]): (ShelvedBook | null)[][] {
  const rows: (ShelvedBook | null)[][] = [];
  for (let i = 0; i < books.length; i += 3) {
    const row: (ShelvedBook | null)[] = books.slice(i, i + 3);
    while (row.length < 3) row.push(null);
    rows.push(row);
  }
  return rows;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { counts, currentlyReading, shelfBooks } = useLibrary();
  const [shelf, setShelf] = useState<BookStatus>('own');

  const books = shelfBooks(shelf);
  const rows = toRows(books);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText variant="label" color={palette.primaryMuted}>
        Boa noite
      </AppText>
      <AppText color={colors.text} style={styles.greeting}>
        Olá, Marina
      </AppText>

      {currentlyReading && (
        <View style={styles.reading}>
          <ReadingNowCard
            book={currentlyReading}
            onPress={() => router.push(`/book/${currentlyReading.id}`)}
          />
        </View>
      )}

      <View style={styles.tabs}>
        <ShelfTabs active={shelf} counts={counts} onChange={setShelf} />
      </View>

      {books.length === 0 ? (
        <EmptyState
          title={EMPTY_TITLES[shelf]}
          message={EMPTY_MESSAGES[shelf]}
          actionLabel="Buscar livros"
          onAction={() => router.push('/(tabs)/search')}
        />
      ) : (
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map((book, ci) =>
                book ? (
                  <BookGridItem
                    key={book.id}
                    book={book}
                    onPress={() => router.push(`/book/${book.id}`)}
                  />
                ) : (
                  <View key={`spacer-${ci}`} style={styles.spacer} />
                ),
              )}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
    paddingBottom: space[6],
  },
  greeting: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 27,
    lineHeight: 32,
    marginTop: 3,
  },
  reading: {
    marginTop: 18,
  },
  tabs: {
    marginTop: 24,
  },
  grid: {
    marginTop: 18,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
});
