import './styles/globals.css';
import { I18nService } from './services/I18nService';
import { Navigation } from './components/Navigation';
import { AnimationController } from './components/AnimationController';

// Initialize services
const i18n = new I18nService();
const navigation = new Navigation();
const animations = new AnimationController();

// Initialize app
async function initializeApp(): Promise<void> {
  try {
    await i18n.initialize();
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Start the app
initializeApp();

// Make i18n globally available for HTML onclick handlers
(window as any).setLanguage = (locale: string) => {
  i18n.setLocale(locale);
};