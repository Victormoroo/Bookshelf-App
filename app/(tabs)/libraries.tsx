/**
 * Bibliotecas — where the user will create collections (by author, saga, genre,
 * etc.). Placeholder for now; the collection-building flow comes in a future
 * stage. Kept as a coherent empty state rather than a blank screen.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, EmptyState } from '@/components/ui';
import { space, useTheme } from '@/theme';

export default function LibrariesScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText color={colors.text} style={styles.heading}>
          Bibliotecas
        </AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.sub}>
          Crie coleções por autor, saga, gênero e muito mais.
        </AppText>
      </View>

      <View style={styles.center}>
        <EmptyState
          title="Suas coleções vão morar aqui"
          message="Em breve você poderá agrupar seus livros em bibliotecas personalizadas. Estamos preparando isso."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
  },
  heading: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 25,
    lineHeight: 30,
  },
  sub: {
    fontSize: 12.5,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
