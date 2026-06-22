/**
 * Settings bottom sheet — appearance (light/dark) and "Sair da conta".
 * Logout simply resets local state and returns to onboarding (no real auth).
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon } from '@/components/ui';
import { elevation, fonts, palette, useTheme } from '@/theme';
import type { ThemeMode } from '@/types';

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function SettingsSheet({ visible, onClose, onLogout }: SettingsSheetProps) {
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();

  const segmentStyle = (active: boolean) => [
    styles.segment,
    active && [styles.segmentActive, { backgroundColor: colors.surface }],
  ];
  const segmentText = (active: boolean) =>
    active ? colors.text : colors.textMuted;

  const ThemeOption = ({ value, label }: { value: ThemeMode; label: string }) => {
    const active = mode === value;
    return (
      <Pressable style={segmentStyle(active)} onPress={() => setMode(value)}>
        <AppText color={segmentText(active)} style={styles.segmentLabel}>
          {label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        <View
          style={[
            styles.sheet,
            elevation[3],
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + 30 },
          ]}
        >
          <View style={styles.header}>
            <AppText color={colors.text} style={styles.title}>
              Configurações
            </AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <AppText color={colors.textMuted} style={styles.close}>
                ×
              </AppText>
            </Pressable>
          </View>

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            Aparência
          </AppText>
          <View style={[styles.segmented, { backgroundColor: colors.surfaceAlt }]}>
            <ThemeOption value="light" label="☀  Claro" />
            <ThemeOption value="dark" label="☾  Escuro" />
          </View>

          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            Conta
          </AppText>
          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.logout, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name="logout" size={17} color="#C46A52" strokeWidth={1.9} />
            <AppText color="#C46A52" style={styles.logoutLabel}>
              Sair da conta
            </AppText>
          </Pressable>
        </View>
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
