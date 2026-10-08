const { test, expect } = require('@playwright/test');
const { openCleanApp, go } = require('./helpers');

test.describe('Navigation & Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
  });

  test('semua menu topbar membuka page yang benar tanpa page overlap', async ({ page }) => {
    for (const route of ['dashboard', 'app', 'catalog', 'customer', 'history', 'settings']) {
      await go(page, route);
      const visiblePages = await page.locator('.page-view:visible').count();
      expect(visiblePages).toBe(1);
    }
  });

  test('dashboard motion, KPI, mini trend, dan recent activity tersedia', async ({ page }) => {
    await expect(page.locator('#aOrders')).toBeVisible();
    await expect(page.locator('#trendSevenDays')).toBeVisible();
    await expect(page.locator('#dashboardRecent')).toBeVisible();
    await expect(page.locator('[data-page="dashboard"]')).toHaveClass(/motion-ready/);
    await expect(page.locator('#trendSevenDays .trend-day')).toHaveCount(7);
  });
});
