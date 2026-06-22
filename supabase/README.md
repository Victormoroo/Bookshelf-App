# Supabase — backend do Bookshelf

## 1. Tornar seu usuário admin

O papel fica em `app_metadata` (não editável pelo usuário). Rode no **SQL Editor** do Supabase, trocando o e-mail pelo seu:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'seu-email@exemplo.com';
```

> Após rodar, faça **logout/login** no app para a sessão recarregar com `role: "admin"`.

## 2. Edge Function `manage-users`

Faz a gestão de usuários (listar / adicionar / remover) com segurança: a chave
`service_role` fica **só no servidor**; a função confere se quem chamou é admin
antes de qualquer operação.

Deploy (precisa do [Supabase CLI](https://supabase.com/docs/guides/cli) e login):

```bash
supabase login
supabase link --project-ref exjteytmhpclohkfbors
supabase functions deploy manage-users
```

Não é preciso configurar secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente nas Edge Functions.
A verificação de JWT (padrão) deve permanecer **ligada** — o app envia o token
do usuário logado e a função valida o papel de admin.

### Ações (POST)
- `{ "action": "list" }`
- `{ "action": "create", "email", "password", "name" }`
- `{ "action": "delete", "id" }`

## 3. Desligar cadastro público (recomendado)

**Authentication → Sign In / Providers (Email)** → desligar *"Allow new users to
sign up"*. Os usuários passam a ser criados só pelo admin (no app ou no painel).
