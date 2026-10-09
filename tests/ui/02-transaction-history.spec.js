const { test, expect } = require('@playwright/test');
const { openCleanApp, go, createTransaction } = require('./helpers');

test.describe('Transaction → History → Edit', () => {
  test.beforeEach(async ({ page }) => {
    await openCleanApp(page);
  });

  test('buat transaksi dari UI, simpan, lalu muncul di History', async ({ page }) => {
    const orderNo = await createTransaction(page);

    await go(page, 'history');
    await expect(page.locator('#historyList')).toContainText(orderNo);
    await expect(page.locator('#historyList')).toContainText('UI TEST CUSTOMER');
    await expect(page.locator('#historyCount')).toContainText('1 transaksi');

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('dkShopHistoryFinal') || '[]')[0]);
    expect(saved.data[0].name).toBe('UI TEST CUSTOMER');
    expect(saved.data[0].item).toBe('UI TEST ITEM');
    expect(saved.data[0].price).toBe(50000);
    expect(saved.discount).toBe(10000);
    expect(saved.shipping).toBe(5000);
  });

  test('edit dari History memperbarui transaksi yang sama dan membuat revision', async ({ page }) => {
    const orderNo = await createTransaction(page);

    await go(page, 'history');
    await page.locator('[data-history-action="open"]').first().click();

    await expect(page).toHaveURL(/#app$/);
    await expect(page.locator('#editBanner')).toBeVisible();
    await expect(page.locator('#orderNo')).toHaveValue(orderNo);

    await page.locator('#editReason').fill('UI regression koreksi harga');
    await page.locator('#rows tr').first().locator('[data-field="price"]').fill('60000');
    await page.locator('[data-action="save-history"]').click();

    await go(page, 'history');
    await expect(page.locator('#historyList')).toContainText(orderNo);
    await expect(page.locator('#historyList')).toContainText('Diubah 1×');
    await expect(page.locator('#historyList')).toContainText('UI regression koreksi harga');

    const all = await page.evaluate(() => JSON.parse(localStorage.getItem('dkShopHistoryFinal') || '[]'));
    expect(all).toHaveLength(1);
    expect(all[0].revision).toBe(1);
    expect(all[0].data[0].price).toBe(60000);
  });


  test('kolom Nama Cust autocomplete membaca Master Customer seperti kolom Pesanan', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('dkShopCustomersV1', JSON.stringify([
      { id:'cust-a', name:'SARAH JIHAN', whatsapp:'628111111111' },
      { id:'cust-b', name:'SAFFA SYANTIKKKK', whatsapp:'628222222222' }
    ])));

    await go(page, 'app');
    const input = page.locator('#rows tr').first().locator('[data-field="name"]');

    await input.fill('SAR');
    await expect(page.locator('.customer-autocomplete-menu:visible')).toContainText('SARAH JIHAN');

    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('SARAH JIHAN');
  });



  test('autocomplete Nama Cust tidak terpotong oleh container tabel', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('dkShopCustomersV1', JSON.stringify([
      { id:'1', name:'SAFFA SYANTIKKKK', whatsapp:'628111111111' },
      { id:'2', name:'SARAH', whatsapp:'628222222222' },
      { id:'3', name:'SARAH JIHAN', whatsapp:'628333333333' },
      { id:'4', name:'SELVI', whatsapp:'628444444444' }
    ])));

    await go(page, 'app');
    const input=page.locator('#rows tr').first().locator('[data-field="name"]');
    await input.fill('SA');

    const menu=page.locator('.customer-autocomplete-menu:visible');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText('SAFFA SYANTIKKKK');
    await expect(menu).toContainText('SARAH');

    const box=await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y+box.height).toBeLessThanOrEqual((await page.viewportSize()).height);
  });



  test('autocomplete Nama Cust menampilkan seluruh Master Customer tanpa limit 8', async ({ page }) => {
    const customers = Array.from({length:15}, (_,i)=>({
      id:`cust-${i+1}`,
      name:`CUSTOMER ${String(i+1).padStart(2,'0')}`,
      whatsapp:`628120000${String(i+1).padStart(4,'0')}`
    }));
    await page.evaluate(rows => localStorage.setItem('dkShopCustomersV1', JSON.stringify(rows)), customers);

    await go(page, 'app');
    const input = page.locator('#rows tr').first().locator('[data-field="name"]');
    await input.focus();

    const options = page.locator('.customer-autocomplete-menu:visible .customer-autocomplete-option');
    await expect(options).toHaveCount(15);
  });



  test('Nama Cust dan Nama Pesanan maksimal 30 karakter', async ({ page }) => {
    await go(page, 'app');
    const row=page.locator('#rows tr').first();
    const customer=row.locator('[data-field="name"]');
    const order=row.locator('[data-field="item"]');
    const longText='ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890EXTRA';

    await expect(customer).toHaveAttribute('maxlength','30');
    await expect(order).toHaveAttribute('maxlength','30');

    await customer.fill(longText);
    await order.fill(longText);

    await expect(customer).toHaveValue(longText.slice(0,30));
    await expect(order).toHaveValue(longText.slice(0,30));
  });



  test('hard cap 30 karakter mencegah ketik dan paste pada Nama Cust dan Nama Pesanan', async ({ page }) => {
    await go(page, 'app');
    const row=page.locator('#rows tr').first();
    const customer=row.locator('[data-field="name"]');
    const order=row.locator('[data-field="item"]');
    const longText='1234567890123456789012345678901234567890';

    await customer.fill(longText);
    await expect(customer).toHaveValue(longText.slice(0,30));

    await order.fill(longText);
    await expect(order).toHaveValue(longText.slice(0,30));

    const custValue=await customer.inputValue();
    const orderValue=await order.inputValue();
    expect(custValue.length).toBe(30);
    expect(orderValue.length).toBe(30);
  });

});
