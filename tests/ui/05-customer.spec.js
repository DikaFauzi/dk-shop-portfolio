const { test, expect } = require('@playwright/test');
const { openCleanApp, go } = require('./helpers');

test.describe('Master Customer UI', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
    await page.evaluate(() => localStorage.setItem('dkShopCustomersV1', '[]'));
    await page.reload();
    await go(page, 'customer');
  });

  test('tambah customer, normalisasi WhatsApp, cari, dan edit', async ({ page }) => {
    await page.locator('#customerAddNew').click();
    await expect(page.locator('#customerForm')).toBeVisible();

    await page.locator('#customerName').fill('CUSTOMER REGRESSION');
    await page.locator('#customerWhatsapp').fill('081298765432');
    await page.locator('#customerSave').click();

    await expect(page.locator('#customerTableBody')).toContainText('CUSTOMER REGRESSION');
    await expect(page.locator('#customerTableBody')).toContainText('6281298765432');

    await page.locator('#customerSearch').fill('CUSTOMER REGRESSION');
    await expect(page.locator('#customerTableBody tr')).toHaveCount(1);

    await page.locator('#customerTableBody [data-customer-action="edit"]').first().click();
    await expect(page.locator('#customerForm')).toBeVisible();
    await page.locator('#customerWhatsapp').fill('081211112222');
    await page.locator('#customerSave').click();

    const rows = await page.evaluate(() => JSON.parse(localStorage.getItem('dkShopCustomersV1') || '[]'));
    const customer = rows.find(x => x.name === 'CUSTOMER REGRESSION');
    expect(customer.whatsapp).toBe('6281211112222');
  });

  test('clear search mengembalikan daftar customer', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('dkShopCustomersV1', JSON.stringify([
      { id: 'a', name: 'ALPHA', whatsapp: '628111111111' },
      { id: 'b', name: 'BETA', whatsapp: '628222222222' }
    ])));
    await page.reload();
    await go(page, 'customer');

    await page.locator('#customerSearch').fill('ALPHA');
    await expect(page.locator('#customerTableBody tr')).toHaveCount(1);
    await expect(page.locator('#customerSearchClear')).toBeVisible();

    await page.locator('#customerSearchClear').click();
    await expect(page.locator('#customerSearch')).toHaveValue('');
    await expect(page.locator('#customerTableBody')).toContainText('ALPHA');
    await expect(page.locator('#customerTableBody')).toContainText('BETA');
  });
});
