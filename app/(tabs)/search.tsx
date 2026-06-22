/**
 * Search ("Adicionar livro") — search the (mock) catalog and quick-add to the
 * "Quero ler" shelf. Includes idle suggestions, a fake loading skeleton, result
 * list and a no-results state. Real results will come from a books API later.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SearchResultRow } from '@/components/books';
import { Screen } from '@/components/layout/Screen';
import { AppText, BookSpines, SearchBar } from '@/components/ui';
import { useCatalog, useLibrary } from '@/context/LibraryProvider';
import { fonts, radius, space, useTheme } from '@/theme';
import type { Book } from '@/types';

const SUGGESTIONS = ['Clarice Lispector', 'Ficção', 'Sapiens', 'O Pequeno Príncipe'];
const SEARCH_DELAY = 650;

export default function SearchScreen() {
  const { colors } = useTheme();
  const catalog = useCatalog();
  const { isInLibrary, quickAdd } = useLibrary();

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const runSearch = (text: string) => {
    setQuery(text);
    if (timer.current) clearTimeout(timer.current);
    if (!text.trim()) {
      setSearching(false);
      setResults([]);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(() => {
      const k = text.trim().toLowerCase();
      setResults(
        catalog.filter(
          (b) =>
            b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k),
        ),
      );
      setSearching(false);
    }, SEARCH_DELAY);
  };

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    setQuery('');
    setSearching(false);
    setResults([]);
  };

  const trimmed = query.trim();
  const idle = !trimmed && !searching;
  const noResults = !!trimmed && !searching && results.length === 0;
  const hasResults = !searching && results.length > 0;

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <AppText color={colors.text} style={styles.heading}>
        Adicionar livro
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.sub}>
        Busque no acervo e adicione à sua estante.
      </AppText>

      <SearchBar value={query} onChangeText={runSearch} onClear={clear} />

      {idle && (
        <View style={styles.idle}>
          <AppText variant="label" color={colors.textMuted} style={styles.sectionLabel}>
            Sugestões
          </AppText>
          <View style={styles.chips}>
            {SUGGESTIONS.map((term) => (
              <Pressable
                key={term}
                onPress={() => runSearch(term)}
                style={[
                  styles.suggestion,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
              >
                <AppText color={colors.link} style={styles.suggestionText}>
                  {term}
                </AppText>
              </Pressable>
            ))}
          </View>
          <View style={styles.hint}>
            <BookSpines variant="small" />
            <AppText variant="caption" color={colors.textMuted} style={styles.hintText}>
              Comece a digitar para encontrar seu próximo livro.
            </AppText>
          </View>
        </View>
      )}

      {searching && (
        <View style={styles.list}>
          {[0.75, 0.6].map((w, i) => (
            <View
              key={i}
              style={[styles.skeletonRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.skeletonCover, { backgroundColor: colors.border }]} />
              <View style={styles.skeletonLines}>
                <View style={[styles.skeletonLine, { width: `${w * 100}%`, backgroundColor: colors.border }]} />
                <View style={[styles.skeletonLine, { width: '45%', backgroundColor: colors.border, marginTop: 7 }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {hasResults && (
        <View style={styles.list}>
          {results.map((book) => (
            <SearchResultRow
              key={book.id}
              book={book}
              inLibrary={isInLibrary(book.id)}
              onAdd={() => quickAdd(book.id)}
            />
          ))}
        </View>
      )}

      {noResults && (
        <View style={styles.noResults}>
          <AppText color={colors.text} style={styles.noResultsTitle}>
            Nenhum livro encontrado
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.noResultsMsg}>
            Tente outro título ou o nome do autor.
          </AppText>
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
  heading: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 25,
    lineHeight: 30,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12.5,
    marginBottom: 16,
  },
  idle: {
    marginTop: 22,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  suggestion: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  suggestionText: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  hint: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 48,
  },
  hintText: {
    textAlign: 'center',
    maxWidth: 240,
  },
  list: {
    marginTop: 18,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
  },
  skeletonCover: {
    width: 34,
    height: 50,
    borderRadius: 4,
  },
  skeletonLines: {
    flex: 1,
  },
  skeletonLine: {
    height: 9,
    borderRadius: 4,
  },
  noResults: {
    marginTop: 40,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 18,
  },
  noResultsMsg: {
    textAlign: 'center',
    maxWidth: 240,
    marginTop: 8,
  },
});
