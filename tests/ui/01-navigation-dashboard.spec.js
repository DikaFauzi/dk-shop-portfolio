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


  test('semua field pencarian dibatasi maksimal 30 karakter', async ({ page }) => {
    await page.goto('/#customer');
    const searches = page.locator('input[type="search"], input[id*="Search"], input[id*="search"], input[class*="search"]');
    const count = await searches.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const input = searches.nth(i);
      await expect(input).toHaveAttribute('maxlength', '30');
      await input.fill('1234567890123456789012345678901234567890');
      await expect(input).toHaveValue('123456789012345678901234567890');
    }
  });

});
