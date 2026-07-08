# 🌀 Premium QR Code Generator

[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=flat-square&logo=vite)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Aplikasi pembuat QR Code premium berbasis web yang berkinerja tinggi, beroperasi sepenuhnya secara *client-side* (tanpa server eksternal), serta memiliki fitur kustomisasi gaya piksel-presisi, penyematan logo kustom, pengaturan tata letak banner, ekspor vektor resolusi tinggi (SVG/PDF), serta manajemen riwayat lokal yang canggih.

Aplikasi ini dibangun menggunakan arsitektur modern **React 19**, **TypeScript**, dan engine utilitas gaya terbaru **Tailwind CSS v4** dengan bundler super cepat **Vite**.

---

## ✨ Fitur Unggulan

### 1. 📂 12+ Tipe Payload QR Code Terintegrasi
Mendukung berbagai macam format data standar industri dengan validasi *real-time*:
*   **Destination URL:** Tautan web aman dengan deteksi otomatis format HTTP/HTTPS.
*   **Plain Text:** Pesan teks statis tanpa batas karakter.
*   **Email Client:** Form siap kirim yang otomatis mengisi alamat email penerima, subjek, serta isi pesan (*body*).
*   **Phone Number:** Membuka aplikasi telepon bawaan perangkat dengan nomor tujuan yang tepat.
*   **SMS Sender:** Mengirim SMS interaktif dengan isi pesan default.
*   **WhatsApp Chat:** Integrasi obrolan langsung lengkap dengan **normalisasi nomor telepon otomatis** (lokal & internasional) serta template pesan cepat (*quick presets*).
*   **WiFi Network Connection:** Memudahkan koneksi nirkabel dengan mendefinisikan SSID, tipe keamanan (WPA/WPA2, WEP, Unsecured), kata sandi, serta tanda bendera *Hidden SSID* (jaringan tersembunyi).
*   **Geolokasi (Location Coordinates):** Berbagi koordinat lintang (*latitude*) dan bujur (*longitude*) siap buka di aplikasi Google Maps atau peta lainnya.
*   **vCard (Kartu Kontak Bisnis):** Kartu nama digital lengkap dengan Nama Depan, Nama Belakang, Nomor Telepon, Email, Nama Organisasi/Perusahaan, Jabatan, Tautan Website, hingga Alamat Rumah/Kantor.
*   **Kalender Acara (Event Planner):** Jadwal kegiatan lengkap dengan Judul Acara, Waktu Mulai & Berakhir (*interactive datetime selection*), Lokasi Acara, dan Deskripsi Detail.
*   **Crypto Address:** Alamat pembayaran cryptocurrency siap pakai untuk Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Litecoin (LTC), dan Dogecoin (DOGE) beserta jumlah opsional.
*   **UPI Payment Gateway:** Memfasilitasi pembayaran cepat di wilayah Asia Selatan dengan VPA (Virtual Payment Address), Nama Penerima, Jumlah Tagihan, dan Catatan Transaksi.
*   **Custom Raw Payload:** Untuk kebutuhan *developer* tingkat lanjut dalam menyusun struktur *string* mentah secara manual.

### 2. 🎨 Kustomisasi Desain Piksel-Presisi (*Style Customizer*)
Kontrol penuh terhadap estetika visual QR Code untuk mencerminkan identitas merek Anda:
*   **Modul QR & Sudut Bulat:**
    *   Kustomisasi tingkat kebulatan modul (*module scale & roundness*) dari tajam klasik hingga bulat futuristik (*smooth dots*).
    *   4 Desain Bingkai Luar Mata QR (*Eye Outer Style*): Square, Rounded, Leaf, dan Circle.
    *   4 Desain Titik Tengah Mata QR (*Eye Inner Style*): Square, Rounded, Leaf, dan Circle.
*   **Skema Warna & Gradien Modern:**
    *   Mode isi warna tunggal (*Solid Color*) atau gradien linear dinamis (*Linear Gradient*).
    *   Kontrol derajat sudut kemiringan gradien secara bebas (0° - 360°).
    *   Warna latar belakang opsional (termasuk dukungan **Background Transparan** murni).
    *   Fitur kustomisasi warna mata QR secara independen (*Independent Eye Colors*) untuk memisahkan warna bingkai luar dan titik tengah dari warna modul bodi utama.

### 3. 🛡️ Penyematan Logo & Personal Brand (*Logo Branding*)
*   Pilih dari beragam preset logo media sosial populer yang langsung tersedia.
*   Unggah file logo kustom Anda sendiri (format PNG/JPG, mendukung ukuran file hingga 2MB).
*   Kontrol parameter kustomisasi logo secara presisi:
    *   Skala ukuran logo (*logo size slider*) untuk menjaga stabilitas keterbacaan kode.
    *   Ketebalan margin pelindung logo (*logo card padding*).
    *   Warna latar belakang wadah logo (*logo card background*) untuk menghindari tumpang tindih warna modul QR.

### 4. 🖼️ Bingkai Banner Cetak Pintar (*Layout, Resolution & Banners*)
*   Penerapan bingkai instan bertema **"SCAN ME"** untuk meningkatkan tingkat konversi pemindaian pengguna.
*   Ubah teks pesan banner secara dinamis.
*   Kustomisasi warna isi latar belakang banner (*banner fill color*) dan warna teks secara mandiri.
*   Kustomisasi ketebalan zona tenang (*Quiet Zone Margin Cells*) untuk penyesuaian estetika tata letak cetak.

### 5. 🚀 Engine Ekspor Resolusi Tinggi Tingkat Industri
Telah diuji dengan hasil gambar tajam siap cetak di media apa pun:
*   **Pilihan Preset Resolusi Ekspor:**
    *   **512 x 512 px:** Cepat untuk pratinjau dan standar aplikasi pesan instan.
    *   **1024 x 1024 px:** Kualitas tinggi untuk kebutuhan cetak brosur atau kartu nama.
    *   **2048 x 2048 px:** Tajam sempurna (*Ultra HD*) untuk dokumen ukuran besar.
    *   **4096 x 4096 px:** Kualitas maksimum (*Billboard Scale*) bebas pecah.
*   **Dukungan Ekspor Multi-Format:**
    *   **PNG / JPEG:** Format raster standar dengan kompresi optimal.
    *   **SVG (Scalable Vector Graphics):** Format vektor murni, sangat disukai desainer profesional untuk diolah kembali di Adobe Illustrator atau Figma tanpa kehilangan ketajaman sedikit pun.
    *   **PDF Document:** Berkas dokumen cetak portabel siap didistribusikan.

### 6. 🕒 Manajemen Riwayat Lokal (*Persistent Generation History*)
*   Penyimpanan riwayat otomatis yang hemat daya menggunakan *client-side* `localStorage`.
*   Fitur pencarian (*search*) berdasarkan tipe payload, judul, atau konten untuk efisiensi tinggi.
*   Muat ulang desain QR Code lama secara instan dengan sekali klik.
*   Ekspor atau hapus riwayat secara kolektif maupun individual.

---

## 🛠️ Arsitektur Proyek & Ekosistem Codebase

Struktur direktori dirancang dengan sangat modular untuk memisahkan logika matematika penggambaran QR dengan komponen interaksi antarmuka (UI):

```text
├── src/
│   ├── components/            # Komponen modular antarmuka pengguna (UI)
│   │   ├── Header.tsx         # Bagian atas aplikasi & tombol navigasi
│   │   ├── ThemeProvider.tsx  # Pengelola tema gelap/terang global
│   │   ├── PayloadForms.tsx   # Pengendali form masukan dinamis (12 tipe)
│   │   ├── StyleCustomizer.tsx# Panel pengaturan bentuk, warna, logo & bingkai
│   │   ├── QRPreview.tsx      # Komponen penampil, pembagi, dan pengekspor QR
│   │   ├── HistorySidebar.tsx # Sidebar riwayat persisten dengan filter pencarian
│   │   └── Toast.tsx          # Sistem notifikasi pop-up interaktif
│   ├── hooks/                 # Custom React hooks untuk fungsionalitas khusus
│   │   └── useQrHistory.ts    # Enkapsulasi manajemen riwayat di localStorage
│   ├── utils/                 # Utilitas fungsional pendukung aplikasi
│   │   ├── qrDraw.ts          # Engine inti untuk menggambar modul, mata, bingkai, dan logo di Canvas/SVG
│   │   └── qrPayloads.ts      # Helper parser, formatter, dan validator payload QR
│   ├── types.ts               # Definisi tipe data TypeScript global yang kuat
│   ├── index.css              # File entri utama CSS Tailwind v4
│   ├── main.tsx               # Titik awal (entry-point) rendering aplikasi React
│   └── App.tsx                # Komponen induk pengatur tata letak & integrasi state
├── index.html                 # Struktur dasar dokumen HTML
├── package.json               # Daftar dependensi & script pembangunan proyek
├── tsconfig.json              # Konfigurasi compiler TypeScript
└── vite.config.ts             # Konfigurasi optimasi bundler Vite
```

---

## 💻 Teknologi yang Digunakan

*   **UI Library:** [React 19](https://react.dev/) (menggunakan fungsional komponen dan React Hooks modern).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) untuk keamanan tipe data, auto-completion maksimal, dan pencegahan bug saat pengembangan.
*   **Styling Engine:** [Tailwind CSS v4.0](https://tailwindcss.com/) dengan arsitektur kecepatan tinggi, variabel CSS bawaan, dan kustomisasi tema yang dinamis.
*   **Animations:** [Motion](https://motion.dev/) (sebelumnya Framer Motion) untuk transisi layout yang fluid, efek hover, dan animasi kemunculan panel yang elegan.
*   **Icons:** [Lucide React](https://lucide.dev/) untuk visualisasi ikon antarmuka yang konsisten dan minimalis.
*   **QR Core Generator:** [node-qrcode](https://github.com/soldair/node-qrcode) sebagai pustaka dasar penghasil matriks biner QR tepercaya.
*   **Export Engines:** [html-to-image](https://github.com/bubkoo/html-to-image) untuk pemrosesan gambar beresolusi tinggi, serta [jspdf](https://github.com/parallax/jsPDF) untuk format dokumen portabel.

---

## 🚀 Panduan Instalasi & Pengoperasian Lokal

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan proyek ini di komputer Anda:

### 1. Prasyarat Sistem
Pastikan Anda telah memasang:
*   [Node.js](https://nodejs.org/) (Sangat direkomendasikan versi LTS terbaru atau minimal versi 18.x).
*   Manajer paket seperti `npm` (bawaan Node.js), `yarn`, atau `pnpm`.

### 2. Kloning Repositori
Buka terminal Anda dan jalankan perintah berikut:
```bash
git clone https://github.com/username-anda/nama-repositori-anda.git
cd nama-repositori-anda
```

### 3. Instalasi Dependensi
Unduh semua pustaka yang diperlukan untuk proyek dengan menjalankan:
```bash
npm install
```
*(atau jika menggunakan Yarn: `yarn install`, jika menggunakan pnpm: `pnpm install`)*

### 4. Menjalankan Mode Pengembangan (*Development Mode*)
Nyalakan server lokal untuk mulai melakukan perubahan dan melihat hasilnya secara langsung (*live preview*):
```bash
npm run dev
```
Setelah server menyala, buka browser Anda dan akses tautan berikut:
`http://localhost:3000`

### 5. Kompilasi untuk Produksi (*Production Build*)
Jika Anda ingin mempublikasikan aplikasi ini ke hosting statis (seperti GitHub Pages, Netlify, Vercel, atau Cloudflare Pages), lakukan kompilasi terlebih dahulu:
```bash
npm run build
```
Perintah di atas akan menghasilkan folder bernama `/dist` yang berisi semua file statis terkompresi (HTML, JS, CSS) yang sangat optimal dan siap diunggah ke penyedia hosting mana pun.

---

## 🎨 Panduan Kontribusi

Kontribusi dari komunitas sangat kami hargai! Jika Anda ingin meningkatkan fungsionalitas, merapikan antarmuka, atau menambahkan format payload baru, silakan ikuti alur berikut:

1.  **Fork** proyek ini di GitHub.
2.  Buat cabang fitur baru (`git checkout -b fitur/fitur-keren-anda`).
3.  Lakukan komit terhadap perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Dorong perubahan ke cabang Anda (`git push origin fitur/fitur-keren-anda`).
5.  Buat **Pull Request** baru untuk kami tinjau bersama.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT License**. Anda bebas menggunakan, memodifikasi, mendistribusikan, dan memanfaatkan proyek ini baik untuk kebutuhan personal maupun komersial.

---

<p align="center">
  Dibuat dengan penuh dedikasi untuk desainer, pengembang, dan pelaku bisnis yang menginginkan QR Code berkualitas tanpa kompromi. 
</p>
