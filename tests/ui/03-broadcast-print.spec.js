const { test, expect } = require('@playwright/test');
const { openCleanApp, go, createTransaction, seedCustomer } = require('./helpers');

test.describe('WhatsApp Broadcast & Print', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
  });

  test('Broadcast WA membaca master customer dan menghasilkan template harga lengkap', async ({ page }) => {
    await seedCustomer(page);
    await createTransaction(page);
    await go(page, 'history');

    await page.locator('[data-history-action="broadcast"]').first().click();
    await expect(page.locator('#broadcastWaModal')).toBeVisible();
    await expect(page.locator('#broadcastWaSubtitle')).toContainText('1 customer');

    const link = page.locator('#broadcastWaList a.wa-send-button').first();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    expect(href).toContain('https://wa.me/6281234567890?text=');

    const url = new URL(href);
    const text = url.searchParams.get('text') || '';
    expect(text).toContain('Halo Kak UI TEST CUSTOMER');
    expect(text).toContain('UI TEST ITEM');
    expect(text).toContain('Harga awal:');
    expect(text).toContain('Diskon:');
    expect(text).toContain('Setelah diskon:');
    expect(text).toContain('Ongkir:');
    expect(text).toContain('Total item:');
    expect(text).toContain('TOTAL BAYAR:');
    expect(text).toContain('Transfer Bank');
    expect(text).toContain('3460790513');
    expect(text).toContain('a/n Dicka Yan Fauzi');
  });

  test('Print dari History menjalankan fallback browser print bila printer Ethernet belum dikonfigurasi', async ({ page }) => {
    await createTransaction(page);
    await go(page, 'history');

    await page.locator('[data-history-action="print"]').first().click();

    await expect.poll(async () => page.evaluate(() => window.__dkPrintCalled)).toBeGreaterThan(0);
    await expect(page.locator('#printItems')).toContainText('UI TEST ITEM');
    await expect(page.locator('#printGrandTotal')).not.toHaveText('Rp0');
  });
});
