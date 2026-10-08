const { test, expect } = require('@playwright/test');
const { openCleanApp, go } = require('./helpers');

test.describe('Catalog UI', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
    await go(page, 'catalog');
  });

  test('tambah produk, cari produk, edit produk', async ({ page }) => {
    await page.locator('#catalogAddButton').click();
    await expect(page.locator('#catalogModal')).toBeVisible();

    await page.locator('#catalogSku').fill('UI-001');
    await page.locator('#catalogCategory').fill('Regression');
    await page.locator('#catalogName').fill('Produk UI Regression');
    await page.locator('#catalogPrice').fill('25000');
    await page.locator('#catalogSaveButton').click();

    await expect(page.locator('#catalogRows')).toContainText('Produk UI Regression');

    await page.locator('#catalogSearch').fill('UI-001');
    await expect(page.locator('#catalogRows tr')).toHaveCount(1);
    await expect(page.locator('#catalogRows')).toContainText('25.000');

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('dkShopCatalogV1') || '[]'));
    expect(saved.some(x => x.sku === 'UI-001' && x.name === 'Produk UI Regression')).toBeTruthy();
  });


  test('kolom Pesanan autocomplete dari Katalog dan otomatis mengisi harga', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('dkShopCatalogV1', JSON.stringify([
      { id:'p1', sku:'UI-FOOD-01', category:'Snack', name:'Potato Crispy Large', price:22500, active:true },
      { id:'p2', sku:'UI-FOOD-02', category:'Snack', name:'Paket-in Komplit Ayam', price:28900, active:true }
    ])));

    await go(page, 'app');
    const row=page.locator('#rows tr').first();
    const item=row.locator('[data-field="item"]');
    const price=row.locator('[data-field="price"]');

    await item.fill('Potato');
    const menu=page.locator('.order-autocomplete-menu:visible');
    await expect(menu).toContainText('Potato Crispy Large');
    await expect(menu).toContainText('UI-FOOD-01');

    await page.keyboard.press('Enter');
    await expect(item).toHaveValue('Potato Crispy Large');
    await expect(price).toHaveValue('22500');
  });



  test('kolom Pesanan hanya memakai satu autocomplete dan tidak memakai native datalist', async ({ page }) => {
    await go(page, 'app');
    const item=page.locator('#rows tr').first().locator('[data-field="item"]');
    await expect(item).not.toHaveAttribute('list', /.+/);
  });

});
