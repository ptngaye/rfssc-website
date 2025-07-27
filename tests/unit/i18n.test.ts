import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService } from '../../src/services/I18nService';

describe('I18nService', () => {
  let i18n: I18nService;

  beforeEach(() => {
    i18n = new I18nService();
  });

  it('should initialize with default locale', async () => {
    await i18n.initialize();
    expect(i18n.getCurrentLocale()).toBe('en');
  });

  it('should translate simple keys', () => {
    const translation = i18n.translate('nav.home');
    expect(typeof translation).toBe('string');
  });

  it('should handle missing translations gracefully', () => {
    const translation = i18n.translate('missing.key');
    expect(translation).toBe('missing.key');
  });
});
