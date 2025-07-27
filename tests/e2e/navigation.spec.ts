import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('should switch languages', async ({ page }) => {
    await page.goto('/');
    
    // Switch to French
    await page.click('[data-lang="fr"]');
    await expect(page.locator('[data-i18n="nav.home"]')).toHaveText('Accueil');
    
    // Switch back to English
    await page.click('[data-lang="en"]');
    await expect(page.locator('[data-i18n="nav.home"]')).toHaveText('Home');
  });
});
