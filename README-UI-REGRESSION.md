# DK SHOP Full UI Regression

## Tujuan

Suite ini menguji DK SHOP melalui browser Chromium sungguhan menggunakan Playwright.

Coverage utama:

- Navigation/router semua menu
- Dashboard KPI, motion, mini trend, recent activity
- Create transaksi
- Save transaksi
- History
- Edit transaksi + revision
- Broadcast WhatsApp + template pembayaran
- Print fallback
- Catalog CRUD/search
- Master Customer CRUD/search/normalisasi WhatsApp
- Settings Profile
- Settings Payment Method → sinkron ke transaksi
- Responsive smoke: 1366x768, 834x1112, 390x844
- Modal Broadcast WA pada mobile

## Cara paling mudah di Windows

Double-click:

`RUN_FULL_UI_REGRESSION.bat`

Pertama kali dijalankan script akan meng-install dependency Playwright dan Chromium.

## Command manual

```bat
npm install
npx playwright install chromium
npm run test:all
```

UI test saja:

```bat
npm run test:ui
```

Dengan browser terlihat:

```bat
npm run test:ui:headed
```

Mode debug:

```bat
npm run test:ui:debug
```

## Hasil jika gagal

Playwright menyimpan artefak failure ke:

- `test-results/`
- screenshot failure
- video failure
- trace failure

HTML report:

`playwright-report/index.html`

## Catatan

Full UI regression menggunakan LocalStorage terisolasi pada browser test dan tidak menyentuh data browser DK SHOP yang dipakai sehari-hari.
