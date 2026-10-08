const { expect } = require('@playwright/test');

const STORAGE_KEYS = [
  'dkShopHistoryFinal',
  'dkShopDraftFinal',
  'dkShopCatalogV1',
  'dkShopPaymentMethodsV1',
  'dkShopProfileV1',
  'dkShopPrinterV1',
  'dkShopCustomersV1',
  'dkShopLastTransactionNo',
  'dkShopTransactionSequenceVersion',
  'dkShopTheme'
];

async function openCleanApp(page) {
  await page.addInitScript(keys => {
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('dkShopPaymentMethodsV1', JSON.stringify([
      { name: 'Transfer Bank', account: '3460790513', owner: 'Dicka Yan Fauzi' },
      { name: 'Cash', account: '', owner: '' }
    ]));
    window.__dkPrintCalled = 0;
    window.print = () => { window.__dkPrintCalled += 1; };
    window.confirm = () => true;
  }, STORAGE_KEYS);

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('[data-page="dashboard"]')).toBeVisible();
}

async function go(page, route) {
  await page.locator(`[data-menu="${route}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#${route}$`));
  await expect(page.locator(`[data-page="${route}"]`)).toBeVisible();
}

async function createTransaction(page, {
  customer = 'UI TEST CUSTOMER',
  item = 'UI TEST ITEM',
  price = '50000',
  shipping = '5000',
  discount = '10000',
  other = '2000',
  status = 'unpaid'
} = {}) {
  await go(page, 'app');

  const first = page.locator('#rows tr').first();
  await first.locator('[data-field="name"]').fill(customer);
  await first.locator('[data-field="item"]').fill(item);
  await first.locator('[data-field="price"]').fill(price);
  await first.locator('[data-field="customOther"]').fill(other);

  await page.locator('#shipping').fill(shipping);
  await page.locator('#discount').fill(discount);
  await page.locator('#orderStatus').selectOption(status);

  await expect(page.locator('#kFinal')).not.toHaveText('Rp0');
  const orderNo = await page.locator('#orderNo').inputValue();

  await page.locator('[data-action="save-history"]').click();
  await expect.poll(async () => {
    return page.evaluate(() => JSON.parse(localStorage.getItem('dkShopHistoryFinal') || '[]').length);
  }).toBe(1);

  return orderNo;
}

async function seedCustomer(page, name = 'UI TEST CUSTOMER', whatsapp = '081234567890') {
  await page.evaluate(({ name, whatsapp }) => {
    localStorage.setItem('dkShopCustomersV1', JSON.stringify([
      { id: 'ui-test-customer', name, whatsapp, active: true }
    ]));
  }, { name, whatsapp });
}

module.exports = { openCleanApp, go, createTransaction, seedCustomer };
