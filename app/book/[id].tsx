/**
 * Book detail — cover, metadata, status selector, reading progress (when
 * "Lendo"), star rating and synopsis. All edits write to the Library context.
 */
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BookCover } from '@/components/ui/BookCover';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/layout/Screen';
import { AppText, StarRating } from '@/components/ui';
import { useLibrary } from '@/context/LibraryProvider';
import { fonts, palette, shelfOrder, space, statusMeta, useTheme } from '@/theme';

export default function BookDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { getShelvedBook, setStatus, setRating, bumpProgress, remove } = useLibrary();

  const book = getShelvedBook(id);

  // If the book leaves the library (e.g. removed), return to the shelves.
  useEffect(() => {
    if (!book) router.back();
  }, [book]);

  if (!book) return null;

  const percent = Math.round((book.currentPage / book.pages) * 100);
  const isReading = book.status === 'reading';

  const handleRemove = () => {
    remove(id);
    router.back();
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText color={colors.link} style={styles.back}>
            ‹ Estante
          </AppText>
        </Pressable>
        <Pressable onPress={handleRemove} hitSlop={8}>
          <AppText color={palette.error} style={styles.remove}>
            Remover
          </AppText>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <BookCover title={book.title} color={book.color} width={118} titleSize={14} borderRadius={7} />
        <AppText color={colors.text} style={styles.title}>
          {book.title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.author}>
          {book.author}
        </AppText>
        <AppText color={colors.textMuted} style={styles.meta}>
          {book.genre} · {book.year} · {book.pages} páginas
        </AppText>
      </View>

      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Categoria
      </AppText>
      <View style={styles.chips}>
        {shelfOrder.map((status) => (
          <Chip
            key={status}
            label={statusMeta[status].label}
            selected={book.status === status}
            activeColor={statusMeta[status].color}
            activeDarkText={statusMeta[status].darkText}
            onPress={() => setStatus(id, status)}
          />
        ))}
      </View>

      {isReading && (
        <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.progressHead}>
            <AppText style={{ fontFamily: fonts.bodySemiBold, fontSize: 13 }} color={colors.text}>
              Progresso
            </AppText>
            <AppText color={palette.accent} style={{ fontFamily: fonts.mono, fontSize: 11 }}>
              {percent}%
            </AppText>
          </View>
          <View style={styles.progressBar}>
            <ProgressBar percent={percent} height={6} />
          </View>
          <View style={styles.progressControls}>
            <Pressable
              onPress={() => bumpProgress(id, -10)}
              style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <AppText color={colors.link} style={styles.stepGlyph}>
                –
              </AppText>
            </Pressable>
            <AppText variant="caption" color={colors.textSecondary}>
              pág. {book.currentPage} de {book.pages}
            </AppText>
            <Pressable
              onPress={() => bumpProgress(id, 10)}
              style={[styles.stepBtn, styles.stepBtnPrimary]}
            >
              <AppText color={palette.onPrimary} style={styles.stepGlyph}>
                +
              </AppText>
            </Pressable>
          </View>
        </View>
      )}

      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Sua avaliação
      </AppText>
      <StarRating value={book.rating} onChange={(n) => setRating(id, n)} />

      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Sinopse
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.synopsis}>
        {book.description}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: space[2],
    paddingBottom: space[12],
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  remove: {
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 14,
  },
  title: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 18,
  },
  author: {
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.06 * 10,
    marginTop: 8,
  },
  section: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
    marginTop: 22,
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
  },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  progressBar: {
    marginTop: 11,
  },
  progressControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPrimary: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  stepGlyph: {
    fontSize: 18,
    lineHeight: 20,
  },
  synopsis: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 24,
  },
});
