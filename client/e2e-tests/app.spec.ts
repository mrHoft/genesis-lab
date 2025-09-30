import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');

  // Check if app loads
  await expect(page).toHaveURL('http://localhost:3000/');

  // Check if page has title
  const title = await page.title();
  expect(title).toBeTruthy();

  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
});
