/**
 * Avatar photo menu with IMMEDIATE persistence — for screens without a "Save"
 * step (e.g. the Profile tab). Returns props ready to spread into <ActionSheet>
 * plus `open()` and a `busy` flag.
 *
 * (The Edit Profile screen manages its own deferred flow and does not use this.)
 */
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import type { SheetAction } from '@/components/ui';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import {
  pickAvatarUri,
  removeAvatar,
  updateProfile,
  uploadAvatarFromUri,
  type AvatarSource,
} from '@/lib/profile';

export function useAvatarPhoto() {
  const { user, avatarUrl } = useAuth();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const pick = useCallback(
    async (source: AvatarSource) => {
      if (!user) return;
      const result = await pickAvatarUri(source);
      if (result.status === 'denied') {
        showToast(
          source === 'camera'
            ? 'Permita o acesso à câmera para tirar uma foto.'
            : 'Permita o acesso às fotos para escolher uma imagem.',
        );
        return;
      }
      if (result.status !== 'ok') return;

      setBusy(true);
      try {
        const url = await uploadAvatarFromUri(user.id, result.uri);
        await updateProfile({ avatar_url: url });
        showToast('Foto atualizada.');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Não foi possível atualizar a foto.');
      } finally {
        setBusy(false);
      }
    },
    [user, showToast],
  );

  const confirmRemove = useCallback(() => {
    Alert.alert('Remover foto', 'Deseja remover sua foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          if (!user) return;
          setBusy(true);
          try {
            await removeAvatar(user.id);
            showToast('Foto removida.');
          } catch (e) {
            showToast(e instanceof Error ? e.message : 'Não foi possível remover a foto.');
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  }, [user, showToast]);

  const actionSheetProps = useMemo(() => {
    const actions: SheetAction[] = [];
    if (avatarUrl) {
      actions.push({ label: 'Ver foto', icon: 'eye', onPress: () => setViewerVisible(true) });
    }
    actions.push(
      { label: 'Tirar foto', icon: 'camera', onPress: () => pick('camera') },
      { label: 'Escolher da galeria', icon: 'image', onPress: () => pick('library') },
    );
    return {
      visible,
      title: 'Foto de perfil',
      actions,
      onDelete: avatarUrl ? confirmRemove : undefined,
      onClose: () => setVisible(false),
    };
  }, [visible, avatarUrl, pick, confirmRemove]);

  const imageViewer = useMemo(
    () => ({ visible: viewerVisible, uri: avatarUrl, onClose: () => setViewerVisible(false) }),
    [viewerVisible, avatarUrl],
  );

  return { open: () => setVisible(true), busy, actionSheetProps, imageViewer };
}
