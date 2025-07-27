interface Translation {
    [key: string]: string | Translation;
  }
  
  interface TranslationData {
    [locale: string]: Translation;
  }
  
  export class I18nService {
    private currentLocale: string = 'en';
    private translations: TranslationData = {};
    private fallbackLocale: string = 'en';
    
    constructor(
      private storageKey: string = 'preferred-language',
      private translationsPath: string = './src/translations'
    ) {}
  
    async initialize(): Promise<void> {
      try {
        await this.loadTranslations();
        const savedLocale = this.getStoredLocale() || this.getBrowserLocale();
        await this.setLocale(savedLocale);
      } catch (error) {
        console.error('Failed to initialize I18n:', error);
        await this.setLocale(this.fallbackLocale);
      }
    }
  
    async loadTranslations(): Promise<void> {
      const locales = ['en', 'fr'];
      const promises = locales.map(async (locale) => {
        try {
          const response = await fetch(`${this.translationsPath}/${locale}.json`);
          if (!response.ok) {
            throw new Error(`Failed to load ${locale} translations`);
          }
          return { locale, data: await response.json() };
        } catch (error) {
          console.warn(`Could not load ${locale} translations:`, error);
          return { locale, data: {} };
        }
      });
  
      const results = await Promise.all(promises);
      results.forEach(({ locale, data }) => {
        this.translations[locale] = data;
      });
    }
  
    async setLocale(locale: string): Promise<void> {
      if (!this.translations[locale]) {
        console.warn(`Locale ${locale} not found, using fallback`);
        locale = this.fallbackLocale;
      }
      
      this.currentLocale = locale;
      this.updateDOM();
      this.storeLocale(locale);
      document.documentElement.lang = locale;
      this.updateLanguageButtons();
    }
  
    translate(key: string, params?: Record<string, string>): string {
      const translation = this.getNestedTranslation(key, this.currentLocale) ||
                         this.getNestedTranslation(key, this.fallbackLocale) ||
                         key;
      
      if (params) {
        return this.interpolate(translation, params);
      }
      
      return translation;
    }
  
    private getNestedTranslation(key: string, locale: string): string | null {
      const keys = key.split('.');
      let current: any = this.translations[locale];
      
      for (const k of keys) {
        if (current && typeof current === 'object') {
          current = current[k];
        } else {
          return null;
        }
      }
      
      return typeof current === 'string' ? current : null;
    }
  
    private interpolate(template: string, params: Record<string, string>): string {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return params[key] || match;
      });
    }
  
    private updateDOM(): void {
      const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n')!;
        const translation = this.translate(key);
        element.innerHTML = translation;
      });
    }
  
    private updateLanguageButtons(): void {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnElement = btn as HTMLElement;
        if (btnElement.dataset.lang === this.currentLocale) {
          btn.classList.add('active');
        }
      });
    }
  
    private getStoredLocale(): string | null {
      try {
        return localStorage.getItem(this.storageKey);
      } catch (error) {
        return null;
      }
    }
  
    private storeLocale(locale: string): void {
      try {
        localStorage.setItem(this.storageKey, locale);
      } catch (error) {
        console.warn('Could not store locale preference');
      }
    }
  
    private getBrowserLocale(): string {
      const browserLang = navigator.language.split('-')[0];
      return this.translations[browserLang] ? browserLang : this.fallbackLocale;
    }
  
    getCurrentLocale(): string {
      return this.currentLocale;
    }
  }