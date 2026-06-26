/**
 * Profile helpers — update the signed-in user's display name and avatar.
 *
 * The name/avatar URL live in the user's `user_metadata`. The avatar image is
 * uploaded to the public Supabase Storage bucket `avatars` (see supabase/README
 * for the bucket + policies setup); only the resulting public URL is stored.
 */
import { decode } from 'base64-arraybuffer';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

const AVATAR_BUCKET = 'avatars';
/** Avatar images are downscaled to this width before upload. */
const AVATAR_MAX_WIDTH = 512;

export type AvatarSource = 'camera' | 'library';
export type PickAvatarResult =
  | { status: 'ok'; uri: string }
  | { status: 'denied' }
  | { status: 'canceled' };

/**
 * Launches the camera (front-facing) or the library and returns the picked
 * image uri. base64 is NOT requested here — encoding happens at upload time so
 * the picker returns fast.
 */
export async function pickAvatarUri(source: AvatarSource): Promise<PickAvatarResult> {
  const common = { allowsEditing: true, aspect: [1, 1] as [number, number], quality: 0.5 };

  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return { status: 'denied' };
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      ...common,
    });
    return result.canceled ? { status: 'canceled' } : { status: 'ok', uri: result.assets[0].uri };
  }

  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return { status: 'denied' };
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], ...common });
  return result.canceled ? { status: 'canceled' } : { status: 'ok', uri: result.assets[0].uri };
}

/** Updates name and/or avatar URL in user_metadata. */
export async function updateProfile(data: { name?: string; avatar_url?: string }): Promise<void> {
  const { error } = await supabase.auth.updateUser({ data });
  if (error) throw error;
}

/**
 * Uploads a picked image (base64) to Storage and returns its public URL.
 * The file is stored at `<userId>/avatar.<ext>` and overwritten on change.
 */
export async function uploadAvatar(params: {
  userId: string;
  base64: string;
  ext: string;
  contentType: string;
}): Promise<string> {
  const { userId, base64, ext, contentType } = params;
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, decode(base64), { contentType, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  // Cache-bust so the new image shows immediately (same path is reused).
  return `${data.publicUrl}?t=${Date.now()}`;
}

/** Resizes + JPEG-encodes a picked image uri, uploads it, returns the URL. */
export async function uploadAvatarFromUri(userId: string, uri: string): Promise<string> {
  const image = await manipulateAsync(uri, [{ resize: { width: AVATAR_MAX_WIDTH } }], {
    compress: 0.7,
    format: SaveFormat.JPEG,
    base64: true,
  });
  if (!image.base64) throw new Error('Falha ao processar a imagem.');
  return uploadAvatar({ userId, base64: image.base64, ext: 'jpg', contentType: 'image/jpeg' });
}

/** Removes the user's avatar: deletes the stored file(s) and clears the URL. */
export async function removeAvatar(userId: string): Promise<void> {
  // Best-effort cleanup of the stored image(s); ignore storage errors.
  try {
    const { data: files } = await supabase.storage.from(AVATAR_BUCKET).list(userId);
    if (files && files.length > 0) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove(files.map((f) => `${userId}/${f.name}`));
    }
  } catch {
    // ignore — clearing the metadata below is what matters for the UI
  }

  const { error } = await supabase.auth.updateUser({ data: { avatar_url: null } });
  if (error) throw error;
}
