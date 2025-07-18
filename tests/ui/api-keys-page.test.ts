import { expect, test } from '@playwright/test';
import { shouldRunAuthTests, shouldRunNoAuthTests } from '../utils/config.js';

test.describe('API Keys Page', () => {
  test('should load API keys page', async ({ page }) => {
    await page.goto('/app/api-keys');

    // Basic check that the page loads
    await expect(page).toHaveTitle(/API Keys/);

    // Check that the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should require authentication when auth is enabled', async ({
    page,
  }) => {
    test.skip(!shouldRunAuthTests(), 'Auth tests disabled');

    await page.goto('/app/api-keys');

    // Should redirect to sign-in page when not authenticated
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should show API keys content when auth is disabled', async ({
    page,
  }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app/api-keys');

    // Should show API keys content without authentication
    await expect(page).toHaveURL('/app/api-keys');

    // Check that the page has API keys content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should display API keys page structure', async ({ page }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app/api-keys');

    // Check for page header
    await expect(page.getByRole('heading', { name: 'API Keys' })).toBeVisible();

    // Check for create button
    await expect(page.getByRole('link', { name: 'New API Key' })).toBeVisible();

    // Check for table headers
    await expect(
      page.getByText('There are no API Keys available')
    ).toBeVisible();
  });
});
