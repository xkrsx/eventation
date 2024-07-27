import { expect, test } from '@playwright/test';

test('header test', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Eventation logo' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Link to Categories' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Link to Events', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add new event' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find an event' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Link to events of user' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Link to login and registration' }),
  ).toBeVisible();
});
