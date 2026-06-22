/**
 * Profile helpers — update the signed-in user's display name and avatar.
 *
 * The name/avatar URL live in the user's `user_metadata`. The avatar image is
 * uploaded to the public Supabase Storage bucket `avatars` (see supabase/README
 * for the bucket + policies setup); only the resulting public URL is stored.
 */
import { decode } from 'base64-arraybuffer';

import { supabase } from './supabase';

const AVATAR_BUCKET = 'avatars';

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
