import { expect, test as setup } from '@playwright/test';
import { getTestConfig } from '../utils/config.js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const config = getTestConfig();

  // Skip authentication setup if auth is disabled
  if (config.authMethod === 'none') {
    return;
  }

  // Navigate to the sign-in page
  await page.goto('/sign-in');

  // Check if we need to create an account or if one already exists
  const hasSignUpLink = await page
    .getByRole('link', { name: /sign up|register|create account/i })
    .isVisible();

  if (hasSignUpLink) {
    // Create a new account
    await createAccount(page);
  } else {
    // Try to sign in with existing credentials
    await signIn(page);
  }

  // Wait for successful authentication
  await expect(page).toHaveURL(/\/app/);

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});

async function createAccount(page: import('@playwright/test').Page) {
  // Click on sign up link
  await page
    .getByRole('link', { name: /sign up|register|create account/i })
    .click();

  // Fill in registration form
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);
  await page.getByLabel(/confirm password/i).fill(testPassword);

  // Submit the form
  await page
    .getByRole('button', { name: /sign up|register|create account/i })
    .click();

  // Wait for successful registration
  await expect(page).toHaveURL(/\/app/);
}

async function signIn(page: import('@playwright/test').Page) {
  // Use default test credentials
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123!';

  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);

  // Submit the form
  await page.getByRole('button', { name: /sign in|login/i }).click();

  // Wait for successful login
  await expect(page).toHaveURL(/\/app/);
}
