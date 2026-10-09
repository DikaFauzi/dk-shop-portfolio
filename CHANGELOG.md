# v2.0.10 - Order Name Max 50

- Nama Pesanan maksimal 50 karakter.
- Nama Cust tetap maksimal 30 karakter.
- Search field umum tetap maksimal 30 karakter.
- Hard cap input, paste, dan state disesuaikan khusus Nama Pesanan.
- Cache-busting dinaikkan ke v2.0.10.

# v2.0.9 - Hard Cap 30 Characters

- Batas 30 karakter diperkuat dengan capture-phase input guard.
- beforeinput mencegah karakter ke-31 masuk.
- paste dipotong otomatis maksimal 30 karakter.
- MutationObserver memastikan field dinamis juga mendapatkan guard.
- Nama Cust dan Nama Pesanan dibatasi juga pada state transaksi.
- Seluruh search field tetap mengikuti batas 30 karakter.
- Cache-busting dinaikkan ke v2.0.9.

# v2.0.8 - Search / Autocomplete Max 30 Fix

- Maksimal 30 karakter sekarang berlaku juga ke Nama Cust.
- Maksimal 30 karakter sekarang berlaku juga ke Nama Pesanan.
- Customer Search, Katalog Search, dan History Search tetap dibatasi 30 karakter.
- Guard global diperluas untuk field autocomplete.
- Dynamic transaction rows langsung diberi maxlength=30.
- Cache-busting dinaikkan ke v2.0.8.

# v2.0.7 - Global Search Length Guard

- Semua kolom pencarian dibatasi maksimal 30 karakter.
- Berlaku untuk History, Katalog, Customer, dan search field lain.
- Guard diterapkan di HTML melalui maxlength=30.
- Guard JavaScript global memastikan paste/input tidak melewati 30 karakter.
- Cache-busting asset dinaikkan ke v2.0.7.
- UI regression ditambah untuk batas 30 karakter.

# v2.0.6 - Full Master Autocomplete

- Menghapus batas 8 suggestion pada Nama Cust.
- Menghapus batas 8 suggestion pada Nama Pesanan.
- Fokus input kosong sekarang dapat menampilkan seluruh Master Customer / Katalog.
- Pencarian menampilkan seluruh data yang cocok.
- Dropdown tetap scrollable agar UI tetap rapi.
- Cache-busting seluruh asset dinaikkan ke v2.0.6.
- UI regression ditambah untuk memastikan lebih dari 8 data tetap tampil.

# v2.0.5 - GitHub Pages Cache Bust Fix

- Menyamakan cache-busting seluruh CSS/JS ke v2.0.5.
- Mencegah browser/GitHub Pages memakai asset lama dengan URL versi lama.
- Menyinkronkan softwareVersion metadata ke v2.0.5.
- Menambahkan build marker untuk verifikasi versi live.
- Fitur Broadcast WA, Customer, Catalog, printer, dashboard motion, dan transaksi tetap dipertahankan.

# v2.0.4 - Single Pesanan Autocomplete

- Menghapus link native datalist lama dari kolom Pesanan.
- Kolom Pesanan sekarang hanya memakai satu autocomplete custom.
- Auto harga dari Katalog tetap dipertahankan.
- Input manual tetap didukung.
- UI regression ditambah agar native datalist tidak aktif kembali.

# v2.0.3 - Pesanan Autocomplete Consistency

- Kolom Pesanan sekarang memakai UX autocomplete yang sama dengan Nama Cust.
- Suggestion mengambil produk aktif dari Katalog.
- Bisa mencari berdasarkan nama produk, SKU, dan kategori.
- Tetap mendukung input manual.
- Memilih produk otomatis mengisi harga dari Katalog.
- Dropdown memakai portal agar tidak terpotong container tabel.
- Mendukung mouse, Arrow Up/Down, Enter, dan Escape.
- Full UI regression ditambah untuk Catalog → Pesanan autocomplete.

# v2.0.2 - Customer Autocomplete Overflow Fix

- Memperbaiki dropdown Nama Cust yang terpotong oleh container tabel.
- Dropdown sekarang dirender sebagai portal di body dengan posisi fixed.
- Posisi mengikuti input aktif saat scroll/resize.
- Dropdown otomatis memilih posisi bawah/atas sesuai ruang viewport.
- UI regression ditambah untuk memastikan suggestion tidak ter-clipping.

# v2.0.1 - Nama Cust Autocomplete

- Kolom Nama Cust di transaksi sekarang mengikuti UX kolom Pesanan.
- Suggestion mengambil data dari Master Customer.
- Tetap mendukung input manual untuk customer baru.
- Bisa mencari berdasarkan nama atau nomor WhatsApp.
- Mendukung mouse serta keyboard Arrow Up, Arrow Down, Enter, Escape.
- Full UI regression ditambah untuk customer autocomplete.

# v2.0.0 - Full UI Regression Foundation

- Menambahkan Playwright full UI regression.
- Test browser nyata untuk navigation, dashboard, transaksi, History, edit, Broadcast WA, print, Catalog, Customer, dan Settings.
- Menambahkan responsive smoke regression untuk laptop, tablet, dan mobile.
- Menambahkan trace, screenshot, video, dan HTML report saat UI test gagal.
- Menambahkan RUN_FULL_UI_REGRESSION.bat untuk one-click regression di Windows.
- CI GitHub diperluas agar menjalankan core test + full UI regression.

# v1.9.7 - Animated Dashboard

- KPI Dashboard memakai count-up animation saat Dashboard dibuka.
- Mini trend 7 hari tumbuh bertahap dari bawah.
- KPI cards dan panel tampil dengan stagger entrance.
- Menambahkan ambient background glow bergerak pelan.
- Menambahkan Recent Activity yang membaca 5 transaksi terbaru dari History.
- Recent Activity masuk dengan slide-in stagger.
- Mendukung prefers-reduced-motion agar tetap accessible.
- Tetap Vanilla JS, tanpa React.

# v1.9.6 - Customer Search UI

- Merapikan kolom pencarian Customer.
- Menambahkan icon pencarian dan clear button.
- Focus state dibuat lebih jelas dan konsisten dengan UI DK SHOP.
- Search bar dan tombol action disejajarkan rapi di desktop.
- Layout responsive diperbaiki untuk tablet dan mobile.

# v1.9.5 - Customer Table Alignment

- Merapikan proporsi lebar kolom Master Customer.
- Kolom No dibuat lebih kecil.
- Nama Customer mendapat area paling luas.
- No. WhatsApp, Status, dan Aksi dibuat lebih proporsional.
- Tombol Edit dan Hapus sekarang horizontal, bukan bertumpuk.
- Tinggi row dipadatkan dan semua isi disejajarkan vertikal.

# v1.9.4 - WhatsApp Price Breakdown

- Broadcast WhatsApp sekarang menampilkan harga awal, diskon, harga setelah diskon, ongkir, biaya lain, dan total item.
- Total bayar customer tetap ditampilkan terpisah dan lebih menonjol.
- Format pesan dirapikan agar nyaman dibaca di WhatsApp.
- Pesan tetap digroup per customer.

# v1.9.3 - WhatsApp Prefilled Payment Template

- Template WhatsApp broadcast disesuaikan dengan format pembayaran yang diminta.
- Saat klik Kirim WhatsApp, chat tujuan terbuka dengan pesan sudah terisi otomatis.
- Isi pesan: sapaan customer, detail item, total bayar customer, metode bayar, No / ID, dan nama pemilik.
- Pesan tetap digroup per customer dalam satu transaksi.

# v1.9.2 - WhatsApp Broadcast per Transaction

- Menambahkan tombol Broadcast WA pada setiap transaksi di History.
- Pesanan otomatis dikelompokkan per customer.
- Beberapa item customer yang sama digabung menjadi satu pesan WhatsApp.
- Nomor WhatsApp dibaca dari Master Customer.
- Customer tanpa nomor WhatsApp mendapat tombol Lengkapi No. WA dan diarahkan ke menu Customer.
- Pesan berisi detail item, total customer, dan metode pembayaran transaksi.
- Pengiriman menggunakan wa.me dengan pesan prefilled, tanpa API WhatsApp.

# v1.9.1 - Customer Standalone Menu

- Master Customer dipisahkan dari menu Setting.
- Menambahkan menu Customer resmi di top bar.
- Customer menjadi page-view resmi pada router utama.
- CRUD, pencarian, status No. WhatsApp, dan Ambil dari History tetap dipertahankan.
- Fondasi customer tetap menggunakan dkShopCustomersV1 sehingga data lama tidak hilang.

# v1.9.0 - Master Customer

- Menambahkan Master Customer di menu Setting.
- Customer dapat tambah, edit, hapus, cari, dan dilengkapi No. WhatsApp.
- Tombol Ambil dari History membaca nama customer dari dkShopHistoryFinal.
- Deduplikasi nama case-insensitive.
- Nomor WhatsApp yang sudah diisi tidak ditimpa saat sync ulang dari History.
- Menyertakan seed customer dari data history yang sebelumnya diberikan.
- Nomor WhatsApp dinormalisasi ke format 62xxxxxxxxxx saat disimpan.

# v1.8.9 - Payment Account Autofill Fix

- Memperbaiki No / ID metode bayar yang kosong saat membuka menu Aplikasi.
- Detail master metode bayar sekarang diterapkan juga pada initial load, bukan hanya saat dropdown diganti.
- Draft lama seperti `DK SHOP DEMO` tidak lagi menimpa No / ID dan Nama Pemilik jika metode tersebut ada di master Setting.
- Metode historical yang sudah tidak ada di master tetap mempertahankan data transaksi/draft lama.

# v1.8.8 - Payment Method Sync Fix

- Metode Bayar pada Setting sekarang benar-benar menjadi sumber dropdown pada menu Aplikasi.
- Tambah, edit, atau hapus metode di Setting langsung memperbarui dropdown Aplikasi tanpa reload.
- Memilih metode otomatis mengisi No / ID dan Nama Pemilik sesuai master.
- Draft/transaksi lama tetap dapat mempertahankan metode historical jika master sudah berubah.
- Menambahkan sinkronisasi LocalStorage lintas tab.

# v1.8.7 - Payment Method Settings

- Menambahkan master Metode Bayar di menu Setting.
- Metode bayar dapat tambah, edit, dan hapus.
- Tiap metode memiliki Nama Metode, No / ID, dan Nama Pemilik.
- Pilihan metode bayar di transaksi membaca master dari Setting.
- Saat metode dipilih, No / ID dan Nama Pemilik otomatis terisi.
- Data disimpan di LocalStorage dan tetap bisa diedit manual di transaksi.

# v1.8.6 - Edit History Opens Application

- Klik Edit pada History sekarang otomatis pindah ke menu Aplikasi.
- Data transaksi tetap dimuat dengan logic edit existing.
- Setelah route #app aktif, form edit di-scroll ke bagian atas.
- Tidak mengubah perhitungan, penyimpanan, nomor transaksi, atau history.

# v1.8.5 - Transaction Print → Ethernet Printer

- Tombol Print pada transaksi sekarang memakai setting printer Ethernet yang sama dengan Print Test.
- Tombol Print di History juga mencetak transaksi yang dipilih langsung ke MINIPO.
- Menambahkan printer-client.js sebagai connector modular antara transaksi dan Print Bridge.
- Print Bridge menambahkan endpoint /print-transaction dan formatter ESC/POS 58/80 mm.
- Jika printer/bridge tidak siap, sistem otomatis fallback ke dialog print browser.
- Tidak mengubah perhitungan transaksi, history, katalog, atau analytics.

# v1.8.4 - Settings Official Router Fix

- Akar masalah ditemukan di menu.js: route settings sebelumnya tidak termasuk VALID routes.
- Settings sekarang menjadi route resmi bersama dashboard, app, catalog, dan history.
- Tombol topbar Settings memakai data-menu="settings" yang sama dengan router utama.
- Menghapus settings-route.js agar tidak ada dua router yang saling berebut.
- Settings tetap halaman terpisah, bukan konten Dashboard.
- Preview struk dan setting printer tetap berada di halaman Settings.

# v1.8.3 - Fix Settings Navigation

- Memperbaiki tombol Setting yang tidak membuka halaman.
- Routing Setting kini memiliki satu owner: settings-route.js.
- Klik Setting selalu membuka halaman Setting standalone.
- Klik menu lain menutup Setting dan mengembalikan main app.
- Menghapus konflik handler active-state ganda dari settings.js.

# v1.8.2 - Settings Standalone Page

- Settings dipisahkan total dari Dashboard.
- Klik tombol Setting di topbar menampilkan hanya halaman Settings.
- Dashboard, Analytics, dan footer aplikasi disembunyikan selama route #settings aktif.
- Preview struk tetap berada hanya di halaman Settings.
- Navigasi kembali ke Dashboard/menu lain mengembalikan tampilan aplikasi normal.

# v1.8.1 - Topbar Settings & Receipt Preview

- Setting dipisahkan dari menu navigasi utama dan menjadi tombol mandiri di area action topbar.
- Menambahkan preview UI struk pada pengaturan printer.
- Preview otomatis menyesuaikan lebar 58 mm / 80 mm.
- Nama operator pada preview mengikuti Profil Akun.
- Tidak mengubah data transaksi maupun katalog.

# v1.8.0 - Settings, Profile & Ethernet Printer

- Menu Settings terpisah.
- Profil akun lokal: nama dan role bisa diubah.
- Nama profil tampil di topbar.
- Printer MINIPO Ethernet: IP, port, bridge URL, dan ukuran kertas.
- Test Connection dan Print Test ESC/POS.
- Local print bridge tanpa install driver Windows.

# v1.7.7 - SEO & Sharing

- Title kini mencantumkan creator: Dika Fauzi.
- Meta description, canonical, author, creator, robots, Open Graph, dan Twitter/X Card dilengkapi.
- Menambahkan JSON-LD WebApplication schema.
- Menambahkan robots.txt, sitemap.xml, dan site.webmanifest.
- Tidak mengubah logic transaksi, katalog, history, analytics, atau report.

# v1.7.6 - Analytics operasional

- KPI Dashboard: transaksi bulan ini, customer unik, discount distributed, shipping distributed.
- Semua KPI bulan berjalan mengecualikan transaksi cancelled.
- Mini trend 7 hari terakhir menampilkan nilai transaksi dan jumlah transaksi per hari.
- Trend menggunakan history LocalStorage yang sama tanpa mengubah data transaksi.

# v1.7.5 - Seed katalog dari history

- Menambahkan 56 produk katalog hasil deduplikasi data history yang diberikan.
- Normalisasi nama produk case-insensitive dan typo SHILIN/SHILLIN.
- Harga konflik menggunakan harga yang paling konsisten; Chicken Shillin Large = Rp22.500.
- Seed hanya berjalan satu kali dan melakukan upsert, sehingga edit katalog setelahnya tidak ditimpa saat reload.
- Menyertakan file Excel `DK-SHOP-KATALOG-HISTORY-DEDUPE.xlsx` untuk maintenance/import ulang.

## 1.7.4 - Local
- Added complete History report download (.xlsx).
- Report includes Summary, Transactions, Item Detail, and Customer Recap sheets.

# Changelog

## v1.5.1
- Fixed transaction numbers being consumed every time an existing transaction was edited
- Preserved the original transaction number and revision counter during edits
- Committed sequence numbers only when a new transaction is actually saved
- Added a one-time sequence migration to repair legacy gaps caused by edit operations
- Added regression tests for edit and new-transaction numbering

## v1.5.0
- Added reusable and testable core business-logic module
- Added unit tests for largest remainder, amount limits, transaction sequence, and CSV sanitization
- Added GitHub Actions CI for syntax checks and unit tests
- Added a digital-receipt screenshot and expanded project documentation
- Documented architecture, usage, testing, privacy, and local-first limitations

## v1.4.0
- Removed unused `precision.css` and obsolete logo selector overrides
- Synchronized project structure and README with the current source
- Added transaction editing with optional reasons and revision markers
- Prevented transaction-number collisions after sequence reset
- Added excessive-discount and invalid-transaction protection
- Added safe amount limits and large-number layout protection
- Added PNG receipt text wrapping and safer CSV export
- Applied the official DK SHOP logo consistently
- Improved receipt-logo loading and PNG download reliability

## Final Portfolio Edition
- Added portfolio landing hero and feature overview
- Added demo data loader
- Added transaction analytics
- Added transaction status workflow
- Added history status filter and sorting
- Added safer local transaction-number reset
- Improved payment method behavior for Cash
- Improved accessibility labels and responsive layout
- Improved print and PNG receipt metadata
- Added Open Graph metadata for social sharing
- Preserved smart split, LocalStorage, CSV, history, print, and digital receipt features
