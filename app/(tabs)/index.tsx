/**
 * Home (Estante) — greeting, "Lendo agora" hero, shelf tabs and a cover grid,
 * with a per-shelf empty state. Mirrors Wireframes Home · A ★.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BookGridItem, ReadingNowCard, ShelfTabs } from '@/components/books';
import { Screen } from '@/components/layout/Screen';
import { AppText, EmptyState } from '@/components/ui';
import { useLibrary } from '@/context/LibraryProvider';
import { palette, space, useTheme } from '@/theme';
import type { BookStatus, ShelvedBook } from '@/types';
import { getGreeting } from '@/utils/greeting';

const SCREEN_PADDING = space[4] + 4;
const CARD_GAP = 12;

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
  const { width } = useWindowDimensions();
  const { counts, shelfBooks } = useLibrary();
  const [shelf, setShelf] = useState<BookStatus>('own');

  const books = shelfBooks(shelf);
  const rows = toRows(books);
  const greeting = getGreeting();

  const reading = shelfBooks('reading');
  // Carousel card a bit narrower than the viewport so the next one peeks.
  const viewportWidth = width - SCREEN_PADDING * 2;
  const cardWidth = Math.round(viewportWidth * 0.86);
  // Trailing space so the last card can also snap to the left edge.
  const carouselTrailing = viewportWidth - cardWidth;

  const openBook = (id: number) => router.push(`/book/${id}`);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText variant="label" color={palette.primaryMuted}>
        {greeting}
      </AppText>
      <AppText color={colors.text} style={styles.greeting}>
        Olá, Marina
      </AppText>

      {reading.length === 0 && (
        <View
          style={[
            styles.reading,
            styles.noReading,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <AppText variant="label" color={palette.accent} style={styles.noReadingKicker}>
            Lendo agora
          </AppText>
          <AppText variant="title" color={colors.text} style={styles.noReadingTitle}>
            Nenhuma leitura em andamento
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Marque um livro como "Lendo" para acompanhar o progresso por aqui.
          </AppText>
        </View>
      )}

      {reading.length === 1 && (
        <View style={styles.reading}>
          <ReadingNowCard book={reading[0]} onPress={() => openBook(reading[0].id)} />
        </View>
      )}

      {reading.length > 1 && (
        <ScrollView
          horizontal
          style={styles.reading}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + CARD_GAP}
          snapToAlignment="start"
          disableIntervalMomentum
          contentContainerStyle={[styles.carousel, { paddingRight: carouselTrailing }]}
        >
          {reading.map((book) => (
            <View key={book.id} style={{ width: cardWidth }}>
              <ReadingNowCard book={book} onPress={() => openBook(book.id)} />
            </View>
          ))}
        </ScrollView>
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
  carousel: {
    gap: CARD_GAP,
  },
  noReading: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  noReadingKicker: {
    fontSize: 8.5,
    letterSpacing: 0.12 * 8.5,
  },
  noReadingTitle: {
    marginTop: 4,
    marginBottom: 4,
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
