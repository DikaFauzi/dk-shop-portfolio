# DK SHOP — Smart Order Split

Portfolio web app untuk membantu pembagian biaya pesanan secara presisi, menyimpan history transaksi, memantau ringkasan aktivitas, dan membuat struk digital.

## Live Demo
https://dikafauzi.github.io/dk-shop-portfolio/

## Fitur
- Smart split ongkir dan diskon secara proporsional
- Largest remainder agar pembulatan tepat sampai rupiah terakhir
- Biaya custom per item
- Nomor transaksi persisten di browser
- Status transaksi: Draft, Belum Bayar, Sudah Bayar, Selesai, Dibatalkan
- Autosave draft
- History + search + filter + sorting
- Analytics transaksi dari history lokal
- Load demo data
- Metode pembayaran fleksibel
- Print thermal 80 mm
- Download struk PNG
- Copy rincian transaksi
- Export CSV
- Dark mode
- Responsive desktop/mobile
- Tombol reset nomor transaksi dengan konfirmasi

## Tech Stack
HTML5, CSS3, Vanilla JavaScript, LocalStorage, Canvas API

## Catatan Arsitektur
Versi portfolio ini bersifat local-first dan tidak memakai backend. Data tersimpan pada browser/perangkat yang digunakan. Untuk versi produksi multi-device, pengembangan berikutnya dapat menambahkan autentikasi dan database.
