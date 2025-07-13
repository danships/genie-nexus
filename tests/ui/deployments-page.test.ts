import { expect, test } from '@playwright/test';
import { shouldRunAuthTests, shouldRunNoAuthTests } from '../utils/config.js';

test.describe('Deployments Page', () => {
  test('should load deployments page', async ({ page }) => {
    await page.goto('/app/deployments');

    // Basic check that the page loads
    await expect(page).toHaveTitle(/Deployments/);

    // Check that the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should require authentication when auth is enabled', async ({
    page,
  }) => {
    test.skip(!shouldRunAuthTests(), 'Auth tests disabled');

    await page.goto('/app/deployments');

    // Should redirect to sign-in page when not authenticated
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should show deployments content when auth is disabled', async ({
    page,
  }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app/deployments');

    // Should show deployments content without authentication
    await expect(page).toHaveURL('/app/deployments');

    // Check that the page has deployments content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should display default deployments from migration', async ({
    page,
  }) => {
    test.skip(!shouldRunNoAuthTests(), 'No-auth tests disabled');

    await page.goto('/app/deployments');

    // Check for page header
    await expect(
      page.getByRole('heading', { name: 'Deployments' })
    ).toBeVisible();

    // Check for create button
    await expect(
      page.getByRole('link', { name: 'New Deployment' })
    ).toBeVisible();

    // Check for filter controls
    await expect(page.getByText('Filter by Type')).toBeVisible();

    // Check for the three default deployments created in migration
    await expect(page.getByText('Static Echo')).toBeVisible();
    await expect(page.getByText('Static HTTP')).toBeVisible();
    await expect(page.getByText('Proxy HTTP')).toBeVisible();

    // Check for table headers
    await expect(page.locator('th').filter({ hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Type' })).toBeVisible();
    await expect(
      page.locator('th').filter({ hasText: 'Status' })
    ).toBeVisible();
    await expect(
      page.locator('th').filter({ hasText: 'Details' })
    ).toBeVisible();
    await expect(
      page.locator('th').filter({ hasText: 'Actions' })
    ).toBeVisible();
  });
});
