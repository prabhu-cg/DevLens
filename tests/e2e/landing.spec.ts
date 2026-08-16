import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test('renders the DevLens headline and primary navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/DevLens/);
    await expect(
      page.getByRole('heading', { level: 1, name: /from pixels to implementation clarity/i }),
    ).toBeVisible();
  });

  test('navigates from the landing page to the sample documentation', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /view sample documentation/i }).click();

    await expect(page).toHaveURL(/\/sample$/);
    await expect(page.getByRole('heading', { level: 1, name: /checkout flow/i })).toBeVisible();
  });

  test('navigates to the new project form and shows a validation error', async ({ page }) => {
    await page.goto('/projects/new');

    await page.getByRole('button', { name: /create project/i }).click();

    await expect(page.getByText(/project name is required/i)).toBeVisible();
  });
});
