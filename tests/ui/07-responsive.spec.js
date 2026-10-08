const { test, expect } = require('@playwright/test');
const { openCleanApp, go, createTransaction, seedCustomer } = require('./helpers');

const sizes = [
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 }
];

test.describe('Responsive smoke regression', () => {
  for (const size of sizes) {
    test(`${size.name}: topbar dan halaman utama tidak menyebabkan body overflow`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await openCleanApp(page);

      for (const route of ['dashboard', 'app', 'catalog', 'customer', 'history', 'settings']) {
        await go(page, route);
        const overflow = await page.evaluate(() => {
          const el = document.documentElement;
          return Math.max(0, el.scrollWidth - el.clientWidth);
        });
        expect(overflow, `${route} overflow on ${size.name}`).toBeLessThanOrEqual(4);
      }
    });
  }

  test('mobile: modal Broadcast WA tetap berada di viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCleanApp(page);
    await seedCustomer(page);
    await createTransaction(page);
    await go(page, 'history');
    await page.locator('[data-history-action="broadcast"]').first().click();

    const box = await page.locator('.broadcast-dialog').boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.height).toBeLessThanOrEqual(844);
  });
});
