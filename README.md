# 📋 Work Program & Priority Tracker

**Work Program & Priority Tracker** adalah aplikasi web modern, bersih, dan responsif untuk pemantauan program kerja berbasis skala prioritas (*Priority Hierarchy*) yang terintegrasi secara Live dengan **Google Sheets API via Google Apps Script**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8.svg)

---

## ✨ Fitur Utama

- 📁 **Hirarki Multi-Projek**: Pengelompokan hirarki berjenjang `Projek ➔ Program Kerja Utama ➔ Sub-Program Kerja`.
- 🔐 **Autentikasi RBAC**: Peran pengguna berbasis hak akses **ADMIN** (Ketua Tim) dan **MEMBER** (Karyawan).
- 📊 **Dashboard & Overview Projek**: Halaman ringkasan seluruh projek dengan status progress %, counter proker, dan aksi CRUD projek lengkap.
- ⚡ **Google Sheets Live Sync**: Sinkronisasi data NoSQL-style secara real-time ke Google Sheets via Apps Script Web App API dengan *fallback* LocalStorage otomatis.
- 🎯 **Milestone & Progress Engine**: Pengaturan status milestone dinamis (*Done, In Progress, Hold, Not Yet, Tidak ada Link Terkait, Cancel*) dengan kalkulasi otomatis progress % dan *Date Delay Engine*.
- 🔗 **Link Terkait**: Integrasi URL dokumen referensi, Figma, Axure, atau Google Drive.
- 🎨 **Collapsible Sidebar**: Sidebar navigasi dapat dibuka/ditutup secara interaktif dengan skema warna *Light Slate* (`#F1F5F9`) yang elegan.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS + Plus Jakarta Sans / DM Sans Fonts
- **Icon Set**: Lucide React
- **Backend Sync**: Google Apps Script Web App (REST API) + LocalStorage Backup

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository ini**:
   ```bash
   git clone https://github.com/noppaal/ProkerTracker.git
   cd ProkerTracker
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

4. **Buka di browser**:
   Akses `http://localhost:3000`

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi MIT.
