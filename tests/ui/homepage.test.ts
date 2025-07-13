import { expect, test } from '@playwright/test';
import { shouldRunAuthTests, shouldRunNoAuthTests } from '../utils/config.js';

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');

    // Basic check that the page loads
    await expect(page).toHaveTitle(/Genie Nexus/);

    // Check that the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should show sign-in link when auth is enabled', async ({ page }) => {
    test.skip(!shouldRunAuthTests(), 'Auth tests disabled');

    await page.goto('/');

    // Look for login link (the text is "Login" but href is "/sign-in")
    const loginLink = page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();

    // Also check that it links to sign-in
    await expect(loginLink).toHaveAttribute('href', '/sign-in');
  });

  test('should not show auth links when auth is disabled', async ({ page }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/');

    await expect(page).toHaveURL('/app');
  });
});
