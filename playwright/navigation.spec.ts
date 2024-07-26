import { expect, test } from '@playwright/test';

test('header test', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('img', { name: 'Eventation logo' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Events', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Events' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
});
