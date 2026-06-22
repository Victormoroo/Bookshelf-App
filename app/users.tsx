/**
 * Gerir usuários (admin only) — list, add and remove users via the
 * `manage-users` Edge Function. Non-admins are redirected away. No privileged
 * keys live in the app; the function enforces the admin check server-side.
 */
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppText, Button, Icon, TextField } from '@/components/ui';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import { createUser, deleteUser, listUsers, type ManagedUser } from '@/lib/users';
import { fonts, palette, space, useTheme } from '@/theme';

export default function UsersScreen() {
  const { colors } = useTheme();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  // Guard: only admins may see this screen.
  useEffect(() => {
    if (!isAdmin) router.back();
  }, [isAdmin]);

  const load = useCallback(async () => {
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    if (creating) return;
    if (!email.trim() || !password) {
      showToast('Informe e-mail e senha.');
      return;
    }
    setCreating(true);
    try {
      await createUser({ email: email.trim(), password, name: name.trim() || undefined });
      setName('');
      setEmail('');
      setPassword('');
      showToast('Usuário adicionado.');
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Não foi possível adicionar.');
    } finally {
      setCreating(false);
    }
  };

  const onRemove = (target: ManagedUser) => {
    Alert.alert(
      'Remover usuário',
      `Remover ${target.email ?? 'este usuário'}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(target.id);
              showToast('Usuário removido.');
              await load();
            } catch (e) {
              showToast(e instanceof Error ? e.message : 'Não foi possível remover.');
            }
          },
        },
      ],
    );
  };

  if (!isAdmin) return null;

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText color={colors.link} style={styles.back}>
            ‹ Perfil
          </AppText>
        </Pressable>
      </View>

      <AppText color={colors.text} style={styles.heading}>
        Gerir usuários
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.sub}>
        Adicione ou remova quem tem acesso ao app.
      </AppText>

      {/* Add user */}
      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Novo usuário
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextField label="Nome (opcional)" value={name} onChangeText={setName} placeholder="Nome" />
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="pessoa@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Senha provisória"
          password
          autoCapitalize="none"
        />
        <Button
          label="Adicionar usuário"
          fullWidth
          loading={creating}
          onPress={onCreate}
          style={styles.addBtn}
        />
      </View>

      {/* Existing users */}
      <AppText variant="label" color={palette.primaryMuted} style={styles.section}>
        Usuários {users.length > 0 ? `· ${users.length}` : ''}
      </AppText>

      {loading ? (
        <ActivityIndicator color={palette.primary} style={styles.loader} />
      ) : error ? (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <AppText variant="caption" color={palette.error}>
            {error}
          </AppText>
          <Button label="Tentar novamente" variant="secondary" size="small" onPress={load} style={styles.retry} />
        </View>
      ) : (
        <View style={styles.list}>
          {users.map((item) => {
            const isSelf = item.id === user?.id;
            const label = item.name ?? item.email ?? 'Usuário';
            return (
              <View
                key={item.id}
                style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.avatar}>
                  <AppText color={palette.onPrimary} style={styles.avatarLetter}>
                    {label.charAt(0).toUpperCase()}
                  </AppText>
                </View>
                <View style={styles.rowInfo}>
                  <AppText color={colors.text} numberOfLines={1} style={styles.rowName}>
                    {item.name ?? item.email}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
                    {item.name ? item.email : item.role === 'admin' ? 'Administrador' : 'Membro'}
                  </AppText>
                </View>
                {item.role === 'admin' && (
                  <View style={[styles.roleBadge, { borderColor: colors.border }]}>
                    <AppText variant="caption" color={palette.primaryMuted} style={styles.roleText}>
                      Admin
                    </AppText>
                  </View>
                )}
                {isSelf ? (
                  <AppText variant="caption" color={colors.textMuted} style={styles.selfTag}>
                    você
                  </AppText>
                ) : (
                  <Pressable
                    onPress={() => onRemove(item)}
                    hitSlop={8}
                    accessibilityLabel={`Remover ${item.email ?? 'usuário'}`}
                    style={styles.removeBtn}
                  >
                    <Icon name="trash" size={19} color={palette.error} />
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
    paddingBottom: space[12],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  heading: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 25,
    lineHeight: 30,
    marginTop: 8,
  },
  sub: {
    fontSize: 12.5,
    marginTop: 4,
  },
  section: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: space[3],
  },
  addBtn: {
    marginTop: space[2],
    borderRadius: 12,
  },
  retry: {
    marginTop: space[3],
    alignSelf: 'flex-start',
  },
  loader: {
    marginTop: space[6],
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: 'Spectral_500Medium',
    fontSize: 16,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  roleBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10.5,
  },
  selfTag: {
    fontStyle: 'italic',
  },
  removeBtn: {
    padding: 4,
  },
});
