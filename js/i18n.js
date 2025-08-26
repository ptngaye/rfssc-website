/**
 * Internationalization (i18n) Module - Fixed for GitHub Pages
 * Handles language switching and translation management
 * 
 * @author Fellowship of Sub-Saharan Culture
 * @version 1.0.1
 */

class I18n {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.defaultLang = 'en';
        this.supportedLanguages = ['en', 'fr'];
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.setLanguage = this.setLanguage.bind(this);
        this.updateUI = this.updateUI.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    /**
     * Initialize the i18n system
     * Load translations and set initial language
     * @returns {Promise<boolean>} Success status
     */
    async init() {
        try {
            console.log('Initializing i18n system...');
            
            await this.loadTranslations();
            
            // Determine initial language preference
            const initialLang = this.getInitialLanguage();
            this.setLanguage(initialLang);
            
            // Attach event listeners to language buttons
            this.attachLanguageButtonListeners();
            
            this.isInitialized = true;
            console.log(`I18n initialized successfully with language: ${initialLang}`);
            return true;
            
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
            this.fallbackToDefault();
            return false;
        }
    }

    /**
     * Load translation files from locales directory
     * @returns {Promise<void>}
     */
    async loadTranslations() {
        const loadPromises = this.supportedLanguages.map(async (lang) => {
            try {
                // Try different paths for GitHub Pages
                const possiblePaths = [
                    `./locales/${lang}.json`,
                    `locales/${lang}.json`,
                    `./${lang}.json`
                ];
                
                let response = null;
                let translations = null;
                
                for (const path of possiblePaths) {
                    try {
                        console.log(`Trying to load translations from: ${path}`);
                        response = await fetch(path);
                        
                        if (response.ok) {
                            translations = await response.json();
                            console.log(`Successfully loaded translations for ${lang} from ${path}`);
                            break;
                        }
                    } catch (pathError) {
                        console.log(`Failed to load from ${path}:`, pathError.message);
                        continue;
                    }
                }
                
                if (!translations) {
                    throw new Error(`Could not load translations for ${lang} from any path`);
                }
                
                this.translations[lang] = translations;
                console.log(`Loaded translations for: ${lang}`);
                
            } catch (error) {
                console.error(`Error loading translations for ${lang}:`, error);
                
                // If it's not the default language, we can continue
                if (lang !== this.defaultLang) {
                    console.warn(`Using ${this.defaultLang} as fallback for ${lang}`);
                } else {
                    throw error; // Re-throw for default language failures
                }
            }
        });

        await Promise.allSettled(loadPromises);
        
        // Ensure we have at least the default language
        if (!this.translations[this.defaultLang]) {
            throw new Error(`Critical error: Could not load default language (${this.defaultLang})`);
        }
    }

    /**
     * Determine initial language based on user preference and browser settings
     * @returns {string} Language code
     */
    getInitialLanguage() {
        // 1. Check saved preference in localStorage
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            console.log(`Using saved language preference: ${savedLang}`);
            return savedLang;
        }

        // 2. Check browser language
        const browserLang = navigator.language.split('-')[0]; // Get language code without region
        if (this.supportedLanguages.includes(browserLang)) {
            console.log(`Using browser language: ${browserLang}`);
            return browserLang;
        }

        // 3. Check URL parameter (useful for sharing links)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            console.log(`Using URL parameter language: ${urlLang}`);
            return urlLang;
        }

        // 4. Fallback to default
        console.log(`Using default language: ${this.defaultLang}`);
        return this.defaultLang;
    }

    /**
     * Set the active language and update the UI
     * @param {string} lang - Language code (e.g., 'en', 'fr')
     */
    setLanguage(lang) {
        // Validate language support
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported, using ${this.defaultLang}`);
            lang = this.defaultLang;
        }

        // Ensure translations are loaded
        if (!this.translations[lang]) {
            console.warn(`Translations for ${lang} not loaded, using ${this.defaultLang}`);
            lang = this.defaultLang;
        }

        this.currentLang = lang;
        
        // Update UI elements
        this.updateUI();
        this.updateLanguageButtons();
        this.updatePageAttributes(lang);
        
        // Save preference for next visit
        localStorage.setItem('preferred-language', lang);
        
        // Update URL without refresh (for sharing)
        this.updateURL(lang);
        
        console.log(`Language set to: ${lang}`);
    }

    /**
     * Update all UI elements with translations
     */
    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedValue(this.translations[this.currentLang], key);
            
            if (translation) {
                // Handle HTML content vs text content
                if (translation.includes('<')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            } else {
                console.warn(`Translation not found for key: ${key} (lang: ${this.currentLang})`);
                
                // Try fallback to default language
                const fallbackTranslation = this.getNestedValue(this.translations[this.defaultLang], key);
                if (fallbackTranslation) {
                    if (fallbackTranslation.includes('<')) {
                        element.innerHTML = fallbackTranslation;
                    } else {
                        element.textContent = fallbackTranslation;
                    }
                    console.log(`Used fallback translation for: ${key}`);
                }
            }
        });
        
        // Update meta tags
        this.updateMetaTags();
    }

    /**
     * Update language button states
     */
    updateLanguageButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.lang === this.currentLang) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Update page attributes for accessibility and SEO
     * @param {string} lang - Language code
     */
    updatePageAttributes(lang) {
        // Update html lang attribute
        document.documentElement.lang = lang;
        
        // Update page direction if needed (for future RTL support)
        document.documentElement.dir = 'ltr'; // All supported languages are LTR for now
    }

    /**
     * Update meta tags for SEO
     */
    updateMetaTags() {
        // Update page title
        const titleKey = 'hero.fellowship';
        const title = this.t(titleKey) + ' - ' + this.t('hero.culture');
        document.title = title;
        
        // Update meta description
        const descriptionKey = 'hero.description';
        const description = this.t(descriptionKey);
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description.replace(/<[^>]*>/g, ''));
        }
    }

    /**
     * Update URL with language parameter without page refresh
     * @param {string} lang - Language code
     */
    updateURL(lang) {
        const url = new URL(window.location);
        if (lang !== this.defaultLang) {
            url.searchParams.set('lang', lang);
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState({}, '', url);
    }

    /**
     * Attach event listeners to language buttons
     */
    attachLanguageButtonListeners() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(button => {
            button.addEventListener('click', this.handleLanguageChange);
        });
    }

    /**
     * Handle language change button clicks
     * @param {Event} event - Click event
     */
    handleLanguageChange(event) {
        event.preventDefault();
        const lang = event.target.dataset.lang;
        console.log(`Language button clicked: ${lang}`);
        if (lang && lang !== this.currentLang) {
            this.setLanguage(lang);
        }
    }

    /**
     * Get nested value from object using dot notation
     * @param {Object} obj - Object to search in
     * @param {string} path - Dot-separated path (e.g., 'hero.title')
     * @returns {string|null} Translation value or null
     */
    getNestedValue(obj, path) {
        if (!obj || !path) return null;
        
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * Get translation for a key (convenience method)
     * @param {string} key - Translation key
     * @param {string} [lang] - Language code (defaults to current)
     * @returns {string} Translation or key if not found
     */
    t(key, lang = null) {
        const targetLang = lang || this.currentLang;
        const translation = this.getNestedValue(this.translations[targetLang], key);
        
        if (translation) {
            return translation;
        }
        
        // Fallback to default language
        if (targetLang !== this.defaultLang) {
            const fallback = this.getNestedValue(this.translations[this.defaultLang], key);
            if (fallback) {
                return fallback;
            }
        }
        
        // Return key as last resort
        console.warn(`Translation missing for key: ${key}`);
        return key;
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Get supported languages
     * @returns {Array<string>} Array of supported language codes
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    /**
     * Check if a language is supported
     * @param {string} lang - Language code to check
     * @returns {boolean} Whether language is supported
     */
    isLanguageSupported(lang) {
        return this.supportedLanguages.includes(lang);
    }

    /**
     * Fallback to default language when initialization fails
     */
    fallbackToDefault() {
        console.warn('Falling back to default language with basic functionality');
        this.currentLang = this.defaultLang;
        this.updateLanguageButtons();
        this.updatePageAttributes(this.defaultLang);
    }

    /**
     * Get initialization status
     * @returns {boolean} Whether i18n is initialized
     */
    isReady() {
        return this.isInitialized;
    }
}

// Create global instance
const i18n = new I18n();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.init().catch(error => {
            console.error('Failed to initialize i18n on DOMContentLoaded:', error);
        });
    });
} else {
    // DOM is already loaded
    i18n.init().catch(error => {
        console.error('Failed to initialize i18n:', error);
    });
}

// Export for use in other scripts
window.i18n = i18n;