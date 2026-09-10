# DK SHOP — Smart Order Split

DK SHOP adalah aplikasi web statis untuk mengelola pesanan patungan, membagi ongkir dan diskon secara proporsional, menyimpan history transaksi, serta membuat struk digital dan print thermal.

## Fitur

- Nomor transaksi persisten: `DK-TRX-000001`, `DK-TRX-000002`, dst.
- Nomor tidak reset saat tanggal berganti selama data browser tidak dihapus.
- Pembagian ongkir dan diskon dengan metode largest remainder.
- Biaya custom per baris.
- Metode pembayaran fleksibel dengan data demo yang aman untuk portfolio.
- Autosave draft dengan LocalStorage.
- History transaksi dan pencarian.
- Copy rincian pesanan.
- Export CSV.
- Download struk digital PNG.
- Print struk thermal 80 mm.
- Dark mode dan responsive layout.

## Tech Stack

HTML5, CSS3, Vanilla JavaScript, LocalStorage, Canvas API.

## Menjalankan Project

Buka `index.html` langsung di browser atau jalankan server lokal, misalnya:

```bash
python -m http.server 8000
```

## Deployment

Project dapat dipublikasikan lewat GitHub Pages dari branch `main` dan folder `/ (root)`.

## Privacy

Repository ini menggunakan data pembayaran demo. Jangan menyimpan nomor rekening, email, password, API key, atau data pribadi asli di source code repository publik.
