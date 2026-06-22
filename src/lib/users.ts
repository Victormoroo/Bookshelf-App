/**
 * Admin user management — thin client over the `manage-users` Edge Function.
 * The function enforces that the caller is an admin and holds the service-role
 * key server-side; nothing privileged runs in the app.
 */
import { supabase } from './supabase';

export interface ManagedUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: string;
}

interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

/** Invokes the Edge Function and normalizes error messages. */
async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('manage-users', { body });

  if (error) {
    // Non-2xx responses carry the JSON body in error.context.
    let message = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      const parsed = await ctx?.json?.();
      if (parsed?.error) message = parsed.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export async function listUsers(): Promise<ManagedUser[]> {
  const data = await invoke<{ users: ManagedUser[] }>({ action: 'list' });
  return data.users ?? [];
}

export async function createUser(input: CreateUserInput): Promise<void> {
  await invoke({ action: 'create', ...input });
}

export async function deleteUser(id: string): Promise<void> {
  await invoke({ action: 'delete', id });
}
