import { expect, test } from '@playwright/test';

test.describe('Providers Page', () => {
  test('should load providers page', async ({ page }) => {
    await page.goto('/app/providers');

    // Basic check that the page loads
    await expect(page).toHaveTitle(/Providers/);

    // Check that the page has some content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should show providers content', async ({ page }) => {
    await page.goto('/app/providers');

    // Should show providers content
    await expect(page).toHaveURL('/app/providers');

    // Check that the page has providers content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('should display default providers from bootstrap', async ({ page }) => {
    await page.goto('/app/providers');

    // Check for page header
    await expect(
      page.getByRole('heading', { name: 'Providers' })
    ).toBeVisible();

    // Check for filter controls
    await expect(page.getByText('Filter by Type')).toBeVisible();

    // Check for create button
    await expect(
      page.getByRole('link', { name: 'Create Provider' })
    ).toBeVisible();

    // Check for the three default providers created in migration
    await expect(page.getByText('Static Echo Provider')).toBeVisible();
    await expect(page.getByText('Static HTTP Provider')).toBeVisible();
    await expect(page.getByText('Proxy HTTP Provider')).toBeVisible();

    // Check for table headers
    await expect(page.locator('th').filter({ hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Type' })).toBeVisible();
    await expect(
      page.locator('th').filter({ hasText: 'Details' })
    ).toBeVisible();
    await expect(
      page.locator('th').filter({ hasText: 'Actions' })
    ).toBeVisible();
  });
});
