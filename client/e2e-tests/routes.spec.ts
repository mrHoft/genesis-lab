// e2e/routes.spec.ts
import { test, expect } from '@playwright/test';

test.describe('App Routes', () => {
  test('should load gallery page', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page.locator('h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('a.tab:has-text("Gallery")')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('a.tab:has-text("About")')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should load generator page', async ({ page }) => {
    await page.goto('/generator');
    await expect(page.locator('h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('a.tab:has-text("Generator")')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should load 404 page for unknown routes', async ({ page }) => {
    await page.goto('/unknown-route');
    await expect(page.locator('h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have header with logo and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header img[alt="logo"]')).toBeVisible();
    await expect(page.locator('header h3:has-text("Genesis lab")')).toBeVisible();
    await expect(page.locator('header .right app-theme')).toBeVisible();
    await expect(page.locator('header .right app-menu')).toBeVisible();
  });
});
