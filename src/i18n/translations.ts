/**
 * Translation strings. Add new keys here in BOTH languages. Screens that need
 * to localize text read them through `t()` from the LanguageProvider.
 *
 * For now only the Settings sheet is fully localized; the rest of the app can
 * be migrated to `t()` incrementally using this same dictionary.
 */
export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    'settings.title': 'Configurações',
    'settings.profile': 'Perfil',
    'settings.editProfile': 'Editar perfil',
    'settings.appearance': 'Aparência',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Escuro',
    'settings.theme.system': 'Sistema',
    'settings.language': 'Idioma',
    'settings.language.pt': 'Português',
    'settings.language.en': 'Inglês',
    'settings.account': 'Conta',
    'settings.logout': 'Sair da conta',
  },
  en: {
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.editProfile': 'Edit profile',
    'settings.appearance': 'Appearance',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.language': 'Language',
    'settings.language.pt': 'Portuguese',
    'settings.language.en': 'English',
    'settings.account': 'Account',
    'settings.logout': 'Log out',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['pt'];
