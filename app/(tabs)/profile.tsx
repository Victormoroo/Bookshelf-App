/**
 * Profile (Perfil) — reader identity (from the Supabase session), reading-in-
 * numbers stats, pages-read highlight, and a settings sheet (theme + logout).
 * Logout clears the Supabase session and local state, returning to login.
 */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { SettingsSheet, StatCard } from '@/components/profile';
import { ActionSheet, AppText, Avatar, Icon, ImageViewer } from '@/components/ui';
import { useAuth } from '@/context/AuthProvider';
import { useLibrary } from '@/context/LibraryProvider';
import { useAvatarPhoto } from '@/hooks/useAvatarPhoto';
import { palette, space, statusColor, useTheme } from '@/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { displayName, avatarUrl, isAdmin, signOut } = useAuth();
  const { counts, total, pagesRead, reset } = useLibrary();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const photo = useAvatarPhoto();

  const logout = async () => {
    setSettingsOpen(false);
    await signOut();
    reset();
    router.replace('/login');
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <Pressable
            onPress={photo.open}
            disabled={photo.busy}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
          >
            <Avatar name={displayName} uri={avatarUrl} size={58} />
            {photo.busy && (
              <View style={styles.avatarBusy}>
                <ActivityIndicator color={palette.onPrimary} />
              </View>
            )}
          </Pressable>
          <View style={styles.identityText}>
            <AppText color={colors.text} style={styles.name} numberOfLines={1}>
              {displayName}
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

      {isAdmin && (
        <>
          <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
            Administração
          </AppText>
          <Pressable
            onPress={() => router.push('/users')}
            style={({ pressed }) => [
              styles.adminRow,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Icon name="profile" size={20} color={colors.textSecondary} />
            <AppText color={colors.text} style={styles.adminLabel}>
              Gerir usuários
            </AppText>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </Pressable>
        </>
      )}

      <SettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={logout}
      />

      <ActionSheet {...photo.actionSheetProps} />
      <ImageViewer {...photo.imageViewer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
    paddingBottom: space[6],
  },
  avatarBusy: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 29,
    backgroundColor: 'rgba(12,24,22,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
  },
  identityText: {
    flexShrink: 1,
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
    marginLeft: space[3],
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
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  adminLabel: {
    flex: 1,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 15,
  },
});
