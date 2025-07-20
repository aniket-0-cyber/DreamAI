/**
 * A utility for internationalization (i18n) and localization (l10n).
 * This allows the application to support multiple languages and regional formats.
 */

export type Locale = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP';

export type TranslationKey = 
  | 'app.title'
  | 'dream.journal.title'
  | 'dream.journal.subtitle'
  | 'dream.new'
  | 'dream.save'
  | 'dream.lucid'
  | 'dream.clarity'
  | 'welcome.message'
  | 'error.notfound';

// The structure for translation resources.
export type Translations = {
  [key in TranslationKey]?: string;
};

// A dictionary holding all translations for all supported locales.
export const resources: Record<Locale, Translations> = {
  'en-US': {
    'app.title': 'DreamAI',
    'dream.journal.title': 'Dream Journal',
    'dream.journal.subtitle': 'Your personal space to record and reflect on your dreams.',
    'dream.new': 'New Dream',
    'dream.save': 'Save Dream',
    'dream.lucid': 'Lucid Dream',
    'dream.clarity': 'Clarity',
    'welcome.message': 'Welcome, {name}!',
    'error.notfound': 'The requested page could not be found.',
  },
  'es-ES': {
    'app.title': 'DreamAI',
    'dream.journal.title': 'Diario de Sueños',
    'dream.journal.subtitle': 'Tu espacio personal para registrar y reflexionar sobre tus sueños.',
    'dream.new': 'Nuevo Sueño',
    'dream.save': 'Guardar Sueño',
    'dream.lucid': 'Sueño Lúcido',
    'dream.clarity': 'Claridad',
    'welcome.message': '¡Bienvenido, {name}!',
    'error.notfound': 'La página solicitada no pudo ser encontrada.',
  },
  'fr-FR': {
    'app.title': 'DreamAI',
    'dream.journal.title': 'Journal des Rêves',
    'dream.new': 'Nouveau Rêve',
    'dream.save': 'Sauvegarder le Rêve',
  },
  'de-DE': {
    'app.title': 'DreamAI',
    'dream.journal.title': 'Traumtagebuch',
    'welcome.message': 'Willkommen, {name}!',
  },
  'ja-JP': {
    'app.title': 'ドリームAI',
    'dream.journal.title': '夢日記',
    'welcome.message': 'ようこそ、{name}さん！',
  },
};

/**
 * The main I18nManager class.
 */
export class I18nManager {
  private locale: Locale;
  private fallbackLocale: Locale = 'en-US';

  constructor(initialLocale: Locale) {
    this.locale = initialLocale;
  }

  /**
   * Sets the current locale.
   */
  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  /**
   * Gets the current locale.
   */
  getLocale(): Locale {
    return this.locale;
  }

  /**
   * Translates a key into a string for the current locale.
   * Supports simple placeholder replacement.
   * @param key The key to translate.
   * @param replacements An object of placeholder values.
   */
  t(key: TranslationKey, replacements?: Record<string, string | number>): string {
    const currentTranslations = resources[this.locale];
    const fallbackTranslations = resources[this.fallbackLocale];

    let translation = currentTranslations[key] || fallbackTranslations[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, String(value));
      });
    }

    return translation;
  }

  /**
   * Formats a number according to the current locale.
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.locale, options).format(number);
  }

  /**
   * Formats a date according to the current locale.
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat(this.locale, options || defaultOptions).format(date);
  }

  /**
   * Formats a relative time (e.g., "in 5 minutes", "2 days ago").
   */
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' });
    return rtf.format(value, unit);
  }
}

// --- Singleton Instance ---

let globalI18nManager: I18nManager | null = null;

export function getI18nManager(): I18nManager {
  if (!globalI18nManager) {
    // Detect browser language or default to English
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    const initialLocale = (Object.keys(resources).find(loc => browserLang.startsWith(loc.slice(0, 2))) || 'en-US') as Locale;
    globalI18nManager = new I18nManager(initialLocale);
  }
  return globalI18nManager;
}

// --- Example Usage ---
/*
  const i18n = getI18nManager();
  console.log(`Current locale: ${i18n.getLocale()}`);

  // Translate a simple string
  console.log(i18n.t('dream.journal.title'));

  // Translate with placeholder
  console.log(i18n.t('welcome.message', { name: 'Alex' }));

  // Format a number and a date
  console.log(i18n.formatNumber(123456.78));
  console.log(i18n.formatDate(new Date()));

  // Change locale
  i18n.setLocale('es-ES');
  console.log(`\nSwitched locale to: ${i18n.getLocale()}`);
  console.log(i18n.t('dream.journal.title'));
  console.log(i18n.t('welcome.message', { name: 'Alex' }));
  console.log(i18n.formatNumber(123456.78));
  console.log(i18n.formatDate(new Date()));
  console.log(i18n.formatRelativeTime(-2, 'days')); // "hace 2 días"
*/ 