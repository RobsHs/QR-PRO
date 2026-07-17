# 🌀 Premium QR Code Generator

[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=flat-square&logo=vite)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A high-performance premium web-based QR Code generator that operates entirely client-side (no external server required). It features pixel-perfect styling customization, custom logo embedding, banner layout management, high-resolution vector exports (SVG/PDF), and an advanced local history management system.

Built with a modern technology stack including **React 19**, **TypeScript**, **Tailwind CSS v4**, and powered by the lightning-fast **Vite** bundler.

---

# ✨ Features

## 📂 12+ Built-in QR Code Payload Types

Supports industry-standard QR payloads with real-time validation.

- **Destination URL** – Secure website links with automatic HTTP/HTTPS detection.
- **Plain Text** – Unlimited static text.
- **Email** – Pre-filled email address, subject, and body.
- **Phone Number** – Opens the device dialer automatically.
- **SMS** – Generates SMS messages with predefined content.
- **WhatsApp Chat**
  - Automatic phone number normalization
  - Local & international formats
  - Quick message presets
- **WiFi Network**
  - SSID
  - WPA/WPA2
  - WEP
  - Open Network
  - Hidden SSID support
- **Location Coordinates**
  - Latitude & Longitude
  - Compatible with Google Maps and other map applications
- **vCard**
  - First Name
  - Last Name
  - Phone Number
  - Email
  - Organization
  - Job Title
  - Website
  - Address
- **Calendar Event**
  - Event title
  - Start & end datetime
  - Location
  - Description
- **Cryptocurrency Payment**
  - Bitcoin
  - Ethereum
  - Solana
  - Litecoin
  - Dogecoin
  - Optional payment amount
- **UPI Payment**
  - VPA
  - Payee Name
  - Amount
  - Transaction Note
- **Custom Raw Payload**
  - Manual QR string builder for advanced users.

---

# 🎨 Pixel-Perfect Style Customization

Complete visual control over every part of your QR Code.

### QR Modules

- Adjustable module roundness
- Smooth dots
- Classic square modules

### Eye Styles

Outer Eye Styles:

- Square
- Rounded
- Leaf
- Circle

Inner Eye Styles:

- Square
- Rounded
- Leaf
- Circle

### Colors & Gradients

- Solid Color
- Linear Gradient
- Gradient angle (0°–360°)
- Transparent background
- Independent eye colors

---

# 🛡️ Logo Branding

Personalize your QR Code with branding.

- Built-in social media logo presets
- Upload your own PNG/JPG logo (up to 2MB)

Logo customization:

- Logo size
- Logo padding
- Background color
- Safe margin

---

# 🖼️ Smart Banner Layout

Generate professional printable QR Codes.

Features:

- "SCAN ME" banner preset
- Editable banner text
- Custom banner colors
- Custom text colors
- Adjustable Quiet Zone

---

# 🚀 High Resolution Export Engine

Designed for professional printing.

## Export Presets

- 512 × 512 px
- 1024 × 1024 px
- 2048 × 2048 px
- 4096 × 4096 px

## Supported Formats

- PNG
- JPEG
- SVG
- PDF

---

# 🕒 Persistent Local History

Automatically stores QR generations using browser localStorage.

Features:

- Automatic history saving
- Search by payload type
- Search by title
- Search by content
- One-click restore
- Export history
- Delete individual or all records

---

# 🛠️ Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── PayloadForms.tsx
│   │   ├── StyleCustomizer.tsx
│   │   ├── QRPreview.tsx
│   │   ├── HistorySidebar.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   └── useQrHistory.ts
│   ├── utils/
│   │   ├── qrDraw.ts
│   │   └── qrPayloads.ts
│   ├── types.ts
│   ├── index.css
│   ├── main.tsx
│   └── App.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 💻 Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Motion
- Lucide React
- node-qrcode
- html-to-image
- jsPDF
- Vite

---

# 🚀 Installation

## Requirements

- Node.js 18+
- npm / yarn / pnpm

## Clone Repository

```bash
git clone https://github.com/RobsHs/QR-PRO.git
cd QR-PRO
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

---

## Development

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

The production-ready files will be generated inside the **dist** directory, ready for deployment on:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting provider

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork this repository.
2. Create your feature branch.

```bash
git checkout -b feature/awesome-feature
```

3. Commit your changes.

```bash
git commit -m "Add awesome feature"
```

4. Push your branch.

```bash
git push origin feature/awesome-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and commercialize this project in accordance with the MIT License.

---

<p align="center">
Built with passion for developers, designers, businesses, and creators who demand beautiful, reliable, and professional QR Codes without compromise..
</p>
