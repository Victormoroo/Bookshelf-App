/**
 * Login — visual only (this stage). Email + password fields with NO validation,
 * authentication, or session: tapping "Entrar" goes straight to the shelves.
 * Wired to email/password now so it can later connect to Supabase auth.
 *
 * The KeyboardAvoidingView wraps the ScrollView (not the other way around) so
 * the "Entrar" button is pushed above the keyboard / can be scrolled into view.
 */
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, Button, Logo, TextField } from '@/components/ui';
import { fonts, space, useTheme } from '@/theme';

export default function Login() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // No auth/validation yet — go straight to the app.
  const signIn = () => router.replace('/(tabs)');

  // When a field is focused, scroll to the end so the "Entrar" button shows
  // above the keyboard. Small delay lets the keyboard finish opening.
  const revealButton = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo size={64} />
            <AppText color={colors.text} style={styles.title}>
              Bookshelf
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              Entre para abrir a sua estante.
            </AppText>
          </View>

          <View style={styles.form}>
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              onFocus={revealButton}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
            <TextField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              onFocus={revealButton}
              placeholder="••••••••"
              password
              autoCapitalize="none"
            />

            <Pressable onPress={signIn} hitSlop={8} style={styles.forgot}>
              <AppText variant="caption" color={colors.link} style={styles.forgotText}>
                Esqueci minha senha
              </AppText>
            </Pressable>

            <Button label="Entrar" size="large" fullWidth onPress={signIn} style={styles.cta} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    paddingTop: space[12],
    gap: 16,
  },
  title: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: -6,
  },
  form: {
    marginTop: space[12],
    gap: space[4],
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: fonts.bodySemiBold,
  },
  cta: {
    marginTop: space[2],
    borderRadius: 14,
    paddingVertical: 16,
  },
});
