/**
 * Onboarding — the app's visual entry point (stands in for "login"). Three
 * slides; "Pular" or finishing the last slide goes straight to the shelves.
 * No authentication, validation, or session is created (by design, this stage).
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, BookSpines, Button } from '@/components/ui';
import { palette, space, useTheme } from '@/theme';

const SLIDES = [
  {
    title: 'Toda a sua leitura, num só lugar',
    body: 'Reúna o que você tem, lê, leu e quer ler. Simples assim.',
  },
  {
    title: 'Encontre qualquer livro',
    body: 'Busque por título ou autor e adicione à sua estante em segundos.',
  },
  {
    title: 'No seu ritmo, sempre',
    body: 'Sem metas, sem cobrança. Sua estante espera por você.',
  },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const enterApp = () => router.replace('/(tabs)');
  const next = () => (isLast ? enterApp() : setIndex((i) => i + 1));

  const slide = SLIDES[index];

  return (
    <Screen style={styles.screen}>
      <View style={styles.skipRow}>
        <Pressable onPress={enterApp} hitSlop={8}>
          <AppText variant="caption" color={colors.textMuted}>
            Pular
          </AppText>
        </Pressable>
      </View>

      <View style={styles.center}>
        <BookSpines variant="hero" />
        <View style={styles.copy}>
          <AppText
            color={colors.text}
            style={styles.title}
          >
            {slide.title}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.body}>
            {slide.body}
          </AppText>
        </View>
      </View>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === index ? 18 : 7,
                backgroundColor: i === index ? palette.primary : '#D8CFBE',
              },
            ]}
          />
        ))}
      </View>

      <Button
        label={isLast ? 'Começar minha estante' : 'Continuar'}
        size="large"
        fullWidth
        onPress={next}
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: space[2],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  copy: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 30,
    lineHeight: 34,
    textAlign: 'center',
  },
  body: {
    fontSize: 14.5,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 14,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 22,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  cta: {
    borderRadius: 14,
    paddingVertical: 16,
  },
});
