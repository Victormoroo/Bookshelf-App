/**
 * Profile (Perfil) — reader identity, reading-in-numbers stats, pages-read
 * highlight, and a settings sheet (theme + logout). Logout resets local state
 * and returns to onboarding (no real session to clear, by design this stage).
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { SettingsSheet, StatCard } from '@/components/profile';
import { AppText, Icon } from '@/components/ui';
import { useLibrary } from '@/context/LibraryProvider';
import { palette, space, statusColor, useTheme } from '@/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { counts, total, pagesRead, reset } = useLibrary();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const logout = () => {
    setSettingsOpen(false);
    reset();
    router.replace('/onboarding');
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <AppText color={palette.onPrimary} style={styles.avatarLetter}>
              M
            </AppText>
          </View>
          <View>
            <AppText color={colors.text} style={styles.name}>
              Marina
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {total} livros na estante
            </AppText>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Configurações"
          onPress={() => setSettingsOpen(true)}
          style={[styles.settingsBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Icon name="settings" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Sua leitura em números
      </AppText>
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard value={counts.own} label="Tenho" accent={statusColor.own} />
          <StatCard value={counts.reading} label="Lendo" accent={statusColor.reading} />
        </View>
        <View style={styles.statsRow}>
          <StatCard value={counts.read} label="Lido" accent={colors.link} />
          <StatCard value={counts.want} label="Quero ler" accent="#6F8A90" />
        </View>
      </View>

      <View style={styles.pagesCard}>
        <AppText variant="label" color="#7FB0BB" style={styles.pagesLabel}>
          Páginas lidas
        </AppText>
        <AppText color={palette.onPrimary} style={styles.pagesValue}>
          {pagesRead.toLocaleString('pt-BR')}
        </AppText>
        <AppText variant="caption" color="#A9C0C5" style={styles.pagesSub}>
          No seu ritmo, sempre. 📖
        </AppText>
      </View>

      <SettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
    paddingBottom: space[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 24,
  },
  name: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 22,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
    marginTop: 26,
    marginBottom: 12,
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pagesCard: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    padding: 22,
    marginTop: 14,
  },
  pagesLabel: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
  },
  pagesValue: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 40,
    lineHeight: 42,
    marginTop: 8,
  },
  pagesSub: {
    fontSize: 12.5,
    marginTop: 6,
  },
});
