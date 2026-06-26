/**
 * Editar perfil — change display name and profile photo. The name goes to
 * user_metadata; the photo is uploaded to Supabase Storage (bucket `avatars`)
 * and its public URL is saved to user_metadata.avatar_url.
 */
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ActionSheet, AppText, Avatar, Button, TextField, type SheetAction } from '@/components/ui';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import { removeAvatar, updateProfile, uploadAvatar } from '@/lib/profile';
import { fonts, space, useTheme } from '@/theme';

interface PickedImage {
  uri: string;
}

/** Avatar images are downscaled to this width before upload. */
const AVATAR_MAX_WIDTH = 512;

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, displayName, avatarUrl } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(displayName === 'Leitor(a)' ? '' : displayName);
  const [picked, setPicked] = useState<PickedImage | null>(null);
  // Removal is only applied on Save — going back without saving keeps the photo.
  const [markedForRemoval, setMarkedForRemoval] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  const previewUri = picked?.uri ?? (markedForRemoval ? null : avatarUrl);
  const hasPhoto = !!previewUri;

  // Store only the uri — encoding to base64 is deferred to save (after a resize)
  // so the picker returns immediately and the preview shows without delay.
  const applyAsset = (asset: ImagePicker.ImagePickerAsset) => {
    setMarkedForRemoval(false);
    setPicked({ uri: asset.uri });
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showToast('Permita o acesso às fotos para escolher uma imagem.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) applyAsset(result.assets[0]);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      showToast('Permita o acesso à câmera para tirar uma foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) applyAsset(result.assets[0]);
  };

  const choosePhoto = () => setPhotoSheetOpen(true);

  const confirmRemovePhoto = () => {
    Alert.alert(
      'Remover foto',
      'Deseja remover sua foto de perfil? A alteração só será aplicada ao salvar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: markPhotoForRemoval },
      ],
    );
  };

  // Local only — nothing is persisted until the user taps "Salvar".
  const markPhotoForRemoval = () => {
    setPicked(null);
    setMarkedForRemoval(true);
  };

  const save = async () => {
    if (saving || !user) return;
    setSaving(true);
    try {
      // Only remove the saved photo on save (and only if there is one).
      const willRemove = markedForRemoval && !picked && !!avatarUrl;

      const data: { name?: string; avatar_url?: string } = {};
      if (name.trim()) data.name = name.trim();
      if (picked) {
        // Downscale + JPEG-encode here (not at capture) — keeps the preview
        // instant and the upload small.
        const image = await manipulateAsync(
          picked.uri,
          [{ resize: { width: AVATAR_MAX_WIDTH } }],
          { compress: 0.7, format: SaveFormat.JPEG, base64: true },
        );
        if (!image.base64) throw new Error('Falha ao processar a imagem.');
        data.avatar_url = await uploadAvatar({
          userId: user.id,
          base64: image.base64,
          ext: 'jpg',
          contentType: 'image/jpeg',
        });
      }

      if (!data.name && !data.avatar_url && !willRemove) {
        showToast('Nada para salvar.');
        setSaving(false);
        return;
      }

      if (willRemove) {
        await removeAvatar(user.id); // deletes the file + clears avatar_url
        if (data.name) await updateProfile({ name: data.name });
      } else {
        await updateProfile(data);
      }

      showToast('Perfil atualizado.');
      router.back();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const photoActions: SheetAction[] = [
    { label: 'Tirar foto', icon: 'camera', onPress: takePhoto },
    { label: 'Escolher da galeria', icon: 'image', onPress: pickFromLibrary },
  ];
  if (hasPhoto) {
    photoActions.push({
      label: 'Remover foto',
      icon: 'trash',
      onPress: confirmRemovePhoto,
      destructive: true,
    });
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <AppText color={colors.link} style={styles.back}>
                ‹ Perfil
              </AppText>
            </Pressable>
          </View>

          <AppText color={colors.text} style={styles.heading}>
            Editar perfil
          </AppText>

          <View style={styles.avatarBlock}>
            <Avatar name={displayName} uri={previewUri} size={104} />
            <Pressable onPress={choosePhoto} hitSlop={8} disabled={saving}>
              <AppText color={colors.link} style={styles.changePhoto}>
                Alterar foto
              </AppText>
            </Pressable>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nome"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              autoCapitalize="words"
            />
            <Button
              label="Salvar"
              size="large"
              fullWidth
              loading={saving}
              onPress={save}
              style={styles.save}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionSheet
        visible={photoSheetOpen}
        title="Foto de perfil"
        onClose={() => setPhotoSheetOpen(false)}
        actions={photoActions}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space[4] + 4,
    paddingTop: space[2],
    paddingBottom: space[8],
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
  avatarBlock: {
    alignItems: 'center',
    gap: 12,
    marginTop: space[6],
  },
  changePhoto: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  form: {
    marginTop: space[6],
    gap: space[4],
  },
  save: {
    marginTop: space[2],
    borderRadius: 14,
  },
});
