import { expect, test } from '@playwright/test';
import { shouldRunAuthTests, shouldRunNoAuthTests } from '../utils/config.js';

test.describe('App Overview Page', () => {
  test('should load app page', async ({ page }) => {
    await page.goto('/app');

    // Basic check that the page loads
    await expect(page).toHaveTitle(/Genie Nexus/);

    // Check that the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should require authentication when auth is enabled', async ({
    page,
  }) => {
    test.skip(!shouldRunAuthTests(), 'Auth tests disabled');

    await page.goto('/app');

    // Should redirect to sign-in page when not authenticated
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should show dashboard content when auth is disabled', async ({
    page,
  }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app');

    // Should show dashboard content without authentication
    await expect(page).toHaveURL('/app');

    // Check that the page has dashboard content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should display dashboard sections when auth is disabled', async ({
    page,
  }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app');

    // Check for dashboard sections
    await expect(page.getByText('Active Deployments')).toBeVisible();
    await expect(page.getByText('Connected Providers')).toBeVisible();
    await expect(page.getByText('API Keys Available')).toBeVisible();

    // Check for action buttons
    await expect(
      page.getByRole('link', { name: 'New Deployment' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Connect Provider' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Create API Key' })
    ).toBeVisible();
  });
});
