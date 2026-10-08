const { test, expect } = require('@playwright/test');
const { openCleanApp, go } = require('./helpers');

test.describe('Settings UI', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
    await go(page, 'settings');
  });

  test('simpan profil memperbarui chip topbar', async ({ page }) => {
    await page.locator('#settingsProfileName').fill('DK UI TEST');
    await page.locator('#settingsProfileRole').fill('QA Regression');
    await page.locator('#saveProfileSettings').click();

    await expect(page.locator('#profileNameChip')).toHaveText('DK UI TEST');
    const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('dkShopProfileV1') || '{}'));
    expect(profile.name).toBe('DK UI TEST');
    expect(profile.role).toBe('QA Regression');
  });

  test('tambah metode pembayaran tersimpan dan muncul pada transaksi', async ({ page }) => {
    await page.locator('#paymentMethodName').fill('UI BANK');
    await page.locator('#paymentMethodAccount').fill('99887766');
    await page.locator('#paymentMethodOwner').fill('DK QA');
    await page.locator('#savePaymentMethod').click();

    await expect(page.locator('#paymentMethodList')).toContainText('UI BANK');

    await go(page, 'app');
    await page.locator('#paymentMethod').selectOption('UI BANK');
    await expect(page.locator('#paymentAccount')).toHaveValue('99887766');
    await expect(page.locator('#paymentName')).toHaveValue('DK QA');
  });
});
