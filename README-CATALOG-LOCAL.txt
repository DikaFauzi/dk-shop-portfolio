DK SHOP v1.7.0 LOCAL - KATALOG

Fitur baru:
- Menu Katalog Produk
- Tambah/edit/hapus/aktif-nonaktif produk
- Import / Export Excel 2007+ (.xlsx)
- Ambil katalog otomatis dari History Pesanan
- Dedupe nama produk
- Jika ada beberapa harga di history, harga transaksi terbaru dipakai
- Nama Pesanan transaksi bisa dipilih dari katalog
- Harga otomatis mengikuti katalog
- History transaksi lama tetap snapshot dan tidak diubah

Cara jalan lokal:
1. Jalankan START_LOCAL.bat
2. Buka http://localhost:5500
3. Buka menu Katalog
4. Klik Ambil dari History untuk membentuk katalog dari data history browser ini

Catatan penting:
History dan katalog menggunakan LocalStorage browser. Agar history lama terbaca, jalankan project pada origin/URL yang sama dengan yang sebelumnya digunakan bila memungkinkan.


MENU TERPISAH v1.7.0
---------------------
Dashboard, Aplikasi, Katalog, dan History sekarang menjadi view/menu terpisah.
Hanya satu menu ditampilkan pada satu waktu sehingga halaman lebih rapi.
Navigasi memakai hash lokal (#dashboard, #app, #catalog, #history) dan tetap kompatibel dengan hosting statis/GitHub Pages.


EXCEL 2007+
-----------
- Tombol Export Excel menghasilkan file dk-shop-katalog.xlsx.
- Data dibuat sebagai Excel Table bernama KatalogProduk.
- Kolom: SKU, Nama Produk, Kategori, Harga, Status.
- Tombol Contoh Excel mengunduh catalog-template.xlsx dengan contoh pengisian dan sheet Petunjuk.
- Import saat ini tetap menggunakan CSV agar proses import browser tetap ringan dan aman.


IMPORT / EXPORT EXCEL v1.7.2
----------------------------
- Export katalog: Excel 2007+ (.xlsx).
- Import katalog: Excel 2007+ (.xlsx), format sama persis dengan export.
- Sifat import adalah UPDATE / UPSERT, bukan replace seluruh katalog.
- Match utama: SKU. Jika SKU kosong/tidak ada, match berdasarkan Nama Produk.
- Data existing diperbarui sesuai Excel.
- Baris baru yang belum ada ditambahkan.
- Produk yang tidak ada di file import tidak dihapus.
- Import ulang file yang sama tidak membuat duplikat.
- Kolom wajib: Nama Produk dan Harga.
- Kolom lain: SKU, Kategori, Status.


DOWNLOAD REPORT HISTORY
-----------------------
Menu History memiliki tombol "Download Report Lengkap".
Output: Excel 2007+ (.xlsx), berisi:
- Ringkasan
- Transaksi
- Detail Item
- Rekap Customer

Report membaca seluruh History Pesanan yang tersimpan pada browser.


KATALOG SEED v1.7.5
-------------------
56 produk unik dari data history pengguna sudah ditanam otomatis satu kali melalui catalog-seed-history.js.
