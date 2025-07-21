// src/sample-files/i18n.ts

type Translations = {
  [key: string]: string | Translations;
};

class I18n {
  private translations: Translations = {};
  private locale: string = 'en';

  public setLocale(locale: string): void {
    this.locale = locale;
  }

  public addTranslations(locale: string, translations: Translations): void {
    this.translations[locale] = {
      ...(this.translations[locale] as Translations),
      ...translations,
    };
  }

  public t(key: string, substitutions: Record<string, string> = {}): string {
    const keys = key.split('.');
    let translation = this.translations[this.locale];

    for (const k of keys) {
      translation = (translation as Translations)?.[k];
      if (translation === undefined) {
        return key; // Return the key if no translation is found
      }
    }

    let result = String(translation);
    for (const placeholder in substitutions) {
      result = result.replace(
        new RegExp(`{{${placeholder}}}`, 'g'),
        substitutions[placeholder]
      );
    }

    return result;
  }
}

export const i18n = new I18n();

// Example usage:
// i18n.addTranslations('en', {
//   greeting: 'Hello, {{name}}!',
//   farewell: 'Goodbye!'
// });
// i18n.setLocale('en');
// console.log(i18n.t('greeting', { name: 'World' })); 