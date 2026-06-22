# Bookshelf

Aplicativo mobile de estante de leitura, construído em **React Native + Expo (SDK 54) + TypeScript** com **Expo Router**. Esta é a primeira versão funcional de **interface e navegação**, fiel ao projeto importado do Claude Design (Design System, Wireframes e Protótipo interativo).

> Sem backend, sem Supabase, sem API externa e sem autenticação real nesta etapa. Toda a "persistência" é estado local em memória.

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
│   ├── index.tsx               # Entrada → redireciona p/ onboarding
│   ├── onboarding.tsx          # Boas-vindas (entrada visual / "login")
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
│   │   └── cover.ts            # Helpers do gradiente da capa
│   └── components/
│       ├── layout/Screen.tsx   # Wrapper de tela (safe area + fundo)
│       ├── ui/                 # Primitivas reutilizáveis
│       │   ├── AppText, Button, Chip, StatusBadge, SearchBar,
│       │   ├── ProgressBar, StarRating, BookCover, BookSpines,
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
| **Onboarding** | Protótipo / Wireframes (3 telas) | 3 slides, indicadores, "Pular" |
| **Estante (Home)** | Wireframes Home · A ★ | Card "Lendo agora", abas por status com contagem, grade de capas, **estado vazio** por aba |
| **Buscar / Adicionar** | Wireframes Add · A ★ | Sugestões (idle), **skeleton de carregamento (falso)**, resultados, "nenhum resultado", adicionar → toast |
| **Detalhe do livro** | Wireframes Detail · A ★ | Seletor de categoria, progresso de leitura (±10 pág.), avaliação por estrelas, sinopse, remover |
| **Perfil** | Protótipo | Estatísticas (Tenho/Lendo/Lido/Quero ler), páginas lidas, **folha de configurações** (tema claro/escuro, sair) |

Componentes globais: **tab bar** customizada, **toast** (com ação "Desfazer"/"Ver") e **tema claro/escuro**.

### Design tokens
Transcritos diretamente do "Bookshelf Design System": paleta petróleo/papel/âmbar, fontes **Spectral** (display), **Public Sans** (corpo) e **IBM Plex Mono** (rótulos), escala de espaçamento base-4, raios, elevação e cores de status. Centralizados em `src/theme/tokens.ts` — nada de hex/medida solta nos componentes.

---

## Decisões e observações técnicas

- **"Login" = Onboarding.** O projeto importado **não tem tela de credenciais**; a entrada é o onboarding. Ao tocar em "Começar minha estante" (ou "Pular") o usuário vai direto para a Home — sem autenticação, validação ou sessão, exatamente como pedido. "Sair da conta" (Perfil → Configurações) apenas reinicia o estado local e volta ao onboarding.
- **Dados dos livros são mock e temporários** (`src/data/catalog.ts`). Título, autor, capa, sinopse, ano, gênero e páginas virão de uma **API externa de livros** numa etapa futura. Por isso **não** há cadastro manual, upload de capa nem preenchimento de metadados — a busca e o "adicionar" representam apenas o fluxo visual.
- **Capas** são placeholders em gradiente (a partir de uma cor base), com o título sobreposto — serão substituídas por imagens reais da API.
- **Estado** vive em memória via React Context (`LibraryProvider`). Sem persistência: reabrir o app recomeça do onboarding e da estante inicial. A arquitetura já isola as ações (`setStatus`, `quickAdd`, `bumpProgress`, `setRating`, `remove`), facilitando trocar a fonte por Supabase/AsyncStorage depois.
- **Tema claro/escuro** já implementado (tokens do Design System); alternável em Perfil → Configurações.

### Pronto para evoluir
Autenticação com Supabase · banco de dados · busca por API externa · cadastro de livros · controle/status de leitura · biblioteca pessoal · lista de interesses · histórico · perfil do usuário.

### Notas menores
- Os pacotes `@expo-google-fonts/*` carregam apenas os pesos usados em tempo de execução; o bundler ainda inclui os arquivos `.ttf` dos demais pesos. Otimização de bundle (imports por subpath) pode ser feita depois, se necessário.
- `expo-router` usa rotas tipadas (`experiments.typedRoutes`).
