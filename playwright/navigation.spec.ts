import { expect, test } from '@playwright/test';

test('header test', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('MAIN STAGE')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Main stage' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Add', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Find', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'My Events', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Login', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Register', exact: true }),
  ).toBeVisible();
});
