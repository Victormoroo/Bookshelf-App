/**
 * Settings bottom sheet — appearance (light / dark / system), language
 * (Portuguese / English) and "Sair da conta". Logout resets local state and
 * returns to login (no real auth this stage).
 *
 * Only the white sheet slides up; the dark backdrop just fades in (Modal).
 */
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon } from '@/components/ui';
import { useLanguage } from '@/i18n';
import type { Language } from '@/i18n';
import { elevation, fonts, palette, useTheme } from '@/theme';
import type { ThemePreference } from '@/types';

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface Segment<T> {
  value: T;
  label: string;
}

export function SettingsSheet({ visible, onClose, onLogout }: SettingsSheetProps) {
  const { colors, preference, setPreference } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, translateY]);

  const themeOptions: Segment<ThemePreference>[] = [
    { value: 'light', label: `☀  ${t('settings.theme.light')}` },
    { value: 'dark', label: `☾  ${t('settings.theme.dark')}` },
    { value: 'system', label: `◐  ${t('settings.theme.system')}` },
  ];

  const languageOptions: Segment<Language>[] = [
    { value: 'pt', label: t('settings.language.pt') },
    { value: 'en', label: t('settings.language.en') },
  ];

  const Segmented = <T,>({
    options,
    selected,
    onSelect,
  }: {
    options: Segment<T>[];
    selected: T;
    onSelect: (value: T) => void;
  }) => (
    <View style={[styles.segmented, { backgroundColor: colors.surfaceAlt }]}>
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onSelect(option.value)}
            style={[
              styles.segment,
              active && [styles.segmentActive, { backgroundColor: colors.surface }],
            ]}
          >
            <AppText
              color={active ? colors.text : colors.textMuted}
              numberOfLines={1}
              style={styles.segmentLabel}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        <Animated.View
          style={[
            styles.sheet,
            elevation[3],
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + 30,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.header}>
            <AppText color={colors.text} style={styles.title}>
              {t('settings.title')}
            </AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <AppText color={colors.textMuted} style={styles.close}>
                ×
              </AppText>
            </Pressable>
          </View>

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            {t('settings.profile')}
          </AppText>
          <Pressable
            onPress={() => {
              onClose();
              router.push('/edit-profile');
            }}
            style={({ pressed }) => [
              styles.linkRow,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Icon name="profile" size={19} color={colors.textSecondary} />
            <AppText color={colors.text} style={styles.linkLabel}>
              {t('settings.editProfile')}
            </AppText>
            <Icon name="chevron-right" size={19} color={colors.textMuted} />
          </Pressable>

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            {t('settings.appearance')}
          </AppText>
          <Segmented options={themeOptions} selected={preference} onSelect={setPreference} />

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            {t('settings.language')}
          </AppText>
          <Segmented options={languageOptions} selected={language} onSelect={setLanguage} />

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            {t('settings.account')}
          </AppText>
          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.logout, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name="logout" size={17} color="#C46A52" strokeWidth={1.9} />
            <AppText color="#C46A52" style={styles.logoutLabel}>
              {t('settings.logout')}
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(12,24,22,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 22,
    lineHeight: 30,
  },
  close: {
    fontSize: 22,
    lineHeight: 24,
  },
  section: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
    marginBottom: 10,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  linkLabel: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  segmented: {
    flexDirection: 'row',
    gap: 5,
    borderRadius: 13,
    padding: 4,
    marginBottom: 24,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 10,
  },
  segmentActive: {
    ...elevation[1],
  },
  segmentLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1.5,
    borderColor: '#C46A52',
    borderRadius: 13,
    paddingVertical: 14,
  },
  logoutLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
