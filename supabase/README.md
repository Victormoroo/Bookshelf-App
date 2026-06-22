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

## 4. Bucket de avatars (foto de perfil)

A foto de perfil (tela "Editar perfil") é enviada para o Storage e a URL pública
fica em `user_metadata.avatar_url`.

1. **Storage → Create bucket** → nome **`avatars`**, marque **Public bucket**.
2. **SQL Editor** — policies para cada usuário gerir só a própria pasta
   (`<user_id>/...`):

```sql
-- Leitura pública das imagens do bucket avatars
create policy "Avatares são públicos"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Cada usuário cria/atualiza/remove apenas dentro da sua própria pasta
create policy "Usuário gerencia seu avatar"
on storage.objects for all to authenticated
using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text )
with check ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text );
```

Sem o bucket, a edição de **nome** continua funcionando; só o upload da **foto**
falha (o app mostra um aviso).
