# Bookshelf

Aplicativo mobile de estante de leitura, construído em **React Native + Expo (SDK 54) + TypeScript** com **Expo Router**. Esta é a primeira versão funcional de **interface e navegação**, fiel ao projeto importado do Claude Design (Design System, Wireframes e Protótipo interativo).

> A **autenticação de usuário** usa **Supabase** (login com e-mail/senha). O restante — livros, estante, coleções — ainda é estado local/mock; API externa de livros virá depois.

## Configuração do Supabase

A autenticação lê as credenciais de variáveis `EXPO_PUBLIC_*`. Copie `.env.example` para `.env.local` e preencha:

```
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sua-chave-publishable
```

`.env.local` é ignorado pelo Git. O cliente fica em `src/lib/supabase.ts` (sessão persistida via AsyncStorage). Não há cadastro no app — os usuários são criados no Supabase.

---

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o Expo
npm start            # ou: npx expo start
# Em seguida: pressione "i" (iOS), "a" (Android) ou escaneie o QR no Expo Go

# Atalhos diretos
npm run ios
npm run android
npm run web

# Verificação de tipos
npm run typecheck
```

Requer Node 18+ e o app **Expo Go** (ou um simulador iOS / emulador Android).

---

## Estrutura de pastas

```
.
├── app/                        # Rotas (Expo Router, file-based)
│   ├── _layout.tsx             # Root: fontes, providers, Stack, Toast
│   ├── index.tsx               # Entrada → onboarding ou login (flag local)
│   ├── onboarding.tsx          # Boas-vindas (3 cards, swipe + "não mostrar novamente")
│   ├── login.tsx               # Login visual (email/senha, sem validação)
│   ├── (tabs)/                 # Navegação por abas
│   │   ├── _layout.tsx         # Tab bar customizada (Estante/Buscar/Perfil)
│   │   ├── index.tsx           # Home — Estante
│   │   ├── search.tsx          # Buscar / Adicionar livro
│   │   └── profile.tsx         # Perfil + folha de configurações
│   └── book/
│       └── [id].tsx            # Detalhe do livro
│
├── src/
│   ├── theme/                  # Design system
│   │   ├── tokens.ts           # Cores, espaçamento, raio, tipografia, elevação
│   │   ├── ThemeProvider.tsx   # Tema claro/escuro (contexto)
│   │   └── index.ts
│   ├── types/                  # Tipos TypeScript (Book, LibraryEntry, BookStatus…)
│   ├── data/
│   │   └── catalog.ts          # Catálogo mock + estante inicial (temporário)
│   ├── context/
│   │   ├── LibraryProvider.tsx # Fonte de verdade da estante + ações
│   │   └── ToastProvider.tsx   # Toast/snackbar
│   ├── utils/
│   │   ├── cover.ts            # Helpers do gradiente da capa
│   │   └── preferences.ts      # Flag local "não mostrar onboarding" (AsyncStorage)
│   └── components/
│       ├── layout/Screen.tsx   # Wrapper de tela (safe area + fundo)
│       ├── ui/                 # Primitivas reutilizáveis
│       │   ├── AppText, Button, Chip, StatusBadge, SearchBar, TextField,
│       │   ├── ProgressBar, StarRating, BookCover, BookSpines, Logo,
│       │   └── EmptyState, Icon, Toast
│       ├── books/              # ReadingNowCard, BookGridItem, ShelfTabs, SearchResultRow
│       └── profile/            # StatCard, SettingsSheet
│
├── app.json · tsconfig.json · babel.config.js · package.json
```

Alias de import: `@/*` → `src/*` (ex.: `import { useTheme } from '@/theme'`).

---

## Telas implementadas (fiéis ao Design)

| Tela | Origem no projeto importado | Estados visuais |
|------|------------------------------|-----------------|
| **Onboarding** | Protótipo / Wireframes (3 telas) | 3 cards com **swipe** + botão, indicadores tocáveis, "Pular", "Não mostrar novamente" (último card) |
| **Login** | Mínimo coerente (não existe no design) | Email + senha, "Entrar" → Home (sem validação/auth) |
| **Estante (Home)** | Wireframes Home · A ★ | Card "Lendo agora", abas por status com contagem, grade de capas, **estado vazio** por aba |
| **Buscar / Adicionar** | Wireframes Add · A ★ | Sugestões (idle), **skeleton de carregamento (falso)**, resultados, "nenhum resultado", adicionar → toast |
| **Detalhe do livro** | Wireframes Detail · A ★ | Seletor de categoria, progresso de leitura (±10 pág.), avaliação por estrelas, sinopse, remover |
| **Perfil** | Protótipo | Estatísticas (Tenho/Lendo/Lido/Quero ler), páginas lidas, **folha de configurações** (tema claro/escuro, sair) |

Componentes globais: **tab bar** customizada, **toast** (com ação "Desfazer"/"Ver") e **tema claro/escuro**.

### Design tokens
Transcritos diretamente do "Bookshelf Design System": paleta petróleo/papel/âmbar, fontes **Spectral** (display), **Public Sans** (corpo) e **IBM Plex Mono** (rótulos), escala de espaçamento base-4, raios, elevação e cores de status. Centralizados em `src/theme/tokens.ts` — nada de hex/medida solta nos componentes.

---

## Decisões e observações técnicas

- **Fluxo de entrada: Onboarding → Login → Home.** O onboarding tem 3 cards navegáveis por **swipe** ou botão; no último card, "Não mostrar novamente" grava uma flag local (AsyncStorage). Com **sessão ativa**, o app pula direto para a Home; senão vai para o Login (ou onboarding, se ainda não dispensado) — decisão em `app/index.tsx`.
- **Autenticação (Supabase).** O Login usa `signInWithPassword` (e-mail/senha) via `AuthProvider` (`src/context/AuthProvider.tsx`), com sessão persistida em AsyncStorage e auto-refresh. Sem cadastro no app (usuários criados no Supabase). O Perfil mostra o nome/e-mail da sessão; "Sair da conta" faz `signOut()` e volta ao Login. A tela de login não existe no design importado — foi criada como solução mínima e coerente.
- **Dados dos livros são mock e temporários** (`src/data/catalog.ts`). Título, autor, capa, sinopse, ano, gênero e páginas virão de uma **API externa de livros** numa etapa futura. Por isso **não** há cadastro manual, upload de capa nem preenchimento de metadados — a busca e o "adicionar" representam apenas o fluxo visual.
- **Capas** são placeholders em gradiente (a partir de uma cor base), com o título sobreposto — serão substituídas por imagens reais da API.
- **Estado** vive em memória via React Context (`LibraryProvider`). Sem persistência: reabrir o app recomeça do onboarding e da estante inicial. A arquitetura já isola as ações (`setStatus`, `quickAdd`, `bumpProgress`, `setRating`, `remove`), facilitando trocar a fonte por Supabase/AsyncStorage depois.
- **Tema claro/escuro** já implementado (tokens do Design System); alternável em Perfil → Configurações.

### Pronto para evoluir
Autenticação com Supabase · banco de dados · busca por API externa · cadastro de livros · controle/status de leitura · biblioteca pessoal · lista de interesses · histórico · perfil do usuário.

### Notas menores
- Os pacotes `@expo-google-fonts/*` carregam apenas os pesos usados em tempo de execução; o bundler ainda inclui os arquivos `.ttf` dos demais pesos. Otimização de bundle (imports por subpath) pode ser feita depois, se necessário.
- `expo-router` usa rotas tipadas (`experiments.typedRoutes`).
