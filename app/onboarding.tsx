/**
 * Onboarding — the app's visual entry point (stands in for "login"). Three
 * swipeable slides; "Pular", "Continuar" or finishing the last slide goes
 * straight to the shelves. No authentication/session is created (this stage).
 *
 * The center content is a horizontal paging ScrollView, so the user can either
 * drag sideways or tap "Continuar" to advance — both stay in sync with the
 * progress dots.
 */
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, BookSpines, Button } from '@/components/ui';
import { palette, space, useTheme } from '@/theme';
import { setOnboardingSeen } from '@/utils/preferences';

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
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isLast = index === SLIDES.length - 1;

  const goToLogin = () => router.replace('/login');

  const dontShowAgain = async () => {
    await setOnboardingSeen(true);
    goToLogin();
  };

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(SLIDES.length - 1, i));
    scrollRef.current?.scrollTo({ x: target * width, animated: true });
    setIndex(target);
  };

  const next = () => (isLast ? goToLogin() : goTo(index + 1));

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.skipRow}>
        <Pressable onPress={goToLogin} hitSlop={8}>
          <AppText variant="caption" color={colors.textMuted}>
            Pular
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.page, { width }]}>
            <BookSpines variant="hero" />
            <View style={styles.copy}>
              <AppText color={colors.text} style={styles.title}>
                {slide.title}
              </AppText>
              <AppText variant="body" color={colors.textSecondary} style={styles.body}>
                {slide.body}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)} hitSlop={8}>
              <View
                style={[
                  styles.dot,
                  {
                    width: i === index ? 18 : 7,
                    backgroundColor: i === index ? palette.primary : '#D8CFBE',
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        <Button
          label={isLast ? 'Começar minha estante' : 'Continuar'}
          size="large"
          fullWidth
          onPress={next}
          style={styles.cta}
        />

        {isLast && (
          <Pressable onPress={dontShowAgain} hitSlop={8} style={styles.dontShow}>
            <AppText variant="caption" color={colors.textMuted} style={styles.dontShowText}>
              Não mostrar novamente
            </AppText>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 28,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: space[2],
    paddingHorizontal: 28,
  },
  pager: {
    flex: 1,
  },
  pagerContent: {
    flexGrow: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    paddingHorizontal: 28,
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
  footer: {
    paddingHorizontal: 28,
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
  dontShow: {
    alignSelf: 'center',
    paddingVertical: 14,
  },
  dontShowText: {
    textDecorationLine: 'underline',
  },
});
