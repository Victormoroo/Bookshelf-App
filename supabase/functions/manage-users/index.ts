// Supabase Edge Function: manage-users
//
// Admin-only user management. The service_role key NEVER leaves the server —
// the app calls this function with the signed-in user's JWT, the function
// verifies that caller is an admin (app_metadata.role === 'admin') and only
// then performs the privileged operation with the service-role client.
//
// Deploy:  supabase functions deploy manage-users
// (SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are injected
//  automatically by the platform — no extra secrets needed.)
//
// Actions (POST JSON body):
//   { "action": "list" }
//   { "action": "create", "email": "...", "password": "...", "name": "..." }
//   { "action": "delete", "id": "<user-uuid>" }
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') ?? '';

    // 1) Identify the caller from their JWT.
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await caller.auth.getUser();

    if (userError || !user) return json({ error: 'Não autenticado.' }, 401);

    // 2) Authorize: must be an admin.
    const role = (user.app_metadata as { role?: string } | null)?.role;
    if (role !== 'admin') {
      return json({ error: 'Acesso restrito a administradores.' }, 403);
    }

    // 3) Privileged client (service role) for the admin API.
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { action, ...payload } = await req.json();

    if (action === 'list') {
      const { data, error } = await admin.auth.admin.listUsers();
      if (error) throw error;
      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email ?? null,
        name: (u.user_metadata as { name?: string } | null)?.name ?? null,
        role: (u.app_metadata as { role?: string } | null)?.role ?? 'member',
        createdAt: u.created_at,
      }));
      return json({ users });
    }

    if (action === 'create') {
      const { email, password, name } = payload as {
        email?: string;
        password?: string;
        name?: string;
      };
      if (!email || !password) {
        return json({ error: 'E-mail e senha são obrigatórios.' }, 400);
      }
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: name ? { name } : undefined,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ user: { id: data.user?.id, email: data.user?.email } });
    }

    if (action === 'delete') {
      const { id } = payload as { id?: string };
      if (!id) return json({ error: 'id é obrigatório.' }, 400);
      if (id === user.id) return json({ error: 'Você não pode remover a si mesmo.' }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'Ação inválida.' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
