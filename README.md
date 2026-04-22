# 📚 SIRASIP - Sistem Kearsipan

**SIRASIP** adalah Sistem Kearsipan digital yang dirancang untuk mendokumentasikan peminjaman surat dan dokumen pada instansi atau divisi kesekreatariatan. Sistem ini menyediakan fitur pelacakan status lengkap untuk surat dan dokumen yang dipinjam dan dikembalikan secara real-time.

**Live Demo**: [https://sirasip.vercel.app](https://sirasip.vercel.app)

---

## 📋 Daftar Isi

- [Tentang SIRASIP](#tentang-sirasip)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi Lokal](#instalasi-lokal)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Project](#menjalankan-project)
- [Script yang Tersedia](#script-yang-tersedia)
- [Struktur Project](#struktur-project)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## 🎯 Tentang SIRASIP

**SIRASIP (Sistem Kearsipan)** adalah solusi digital modern untuk manajemen arsip dan pelacakan peminjaman dokumen di instansi pemerintah atau swasta, khususnya divisi kesekreatariatan.

### Tujuan Sistem
- 📖 Mendokumentasikan setiap peminjaman surat dan dokumen
- 📊 Melacak status surat/dokumen secara real-time
- 🔍 Mempermudah pencarian dan penemuan dokumen
- 🎯 Meningkatkan transparansi dan akuntabilitas
- ⚡ Mengurangi kehilangan dan kerusakan dokumen
- 📈 Mengarsipkan history lengkap peminjaman

### Manfaat Implementasi
✅ Sistem digitalisasi kearsipan yang terorganisir  
✅ Pencatatan otomatis peminjaman dan pengembalian  
✅ Dashboard monitoring status dokumen real-time  
✅ Laporan dan analitik peminjaman dokumen  
✅ Akses kontrol berbasis role pengguna  
✅ Interface user-friendly dan responsif  

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Manajemen User
- Login/Register aman dengan Supabase Authentication
- Password encryption menggunakan bcryptjs
- Role-based access control (Admin, Petugas Arsip, User Biasa)
- Session management yang aman

### 📋 Manajemen Dokumen & Surat
- Input/registrasi dokumen baru dengan detail lengkap
- Kategorisasi dan penomoran surat
- Upload metadata dokumen
- Pencarian dokumen yang cepat dan akurat

### 🔄 Sistem Peminjaman
- Pencatatan peminjaman dokumen secara otomatis
- Pemberian nomor referensi unik untuk setiap peminjaman
- Tracking peminjam dan tanggal peminjaman
- Automated notification untuk deadline pengembalian

### 📊 Pelacakan Status
- Status real-time: Tersedia, Dipinjam, Dikembalikan
- Timeline lengkap perjalanan dokumen
- History peminjaman per dokumen
- Indikator visual status dokumen

### 📈 Dashboard & Laporan
- Dashboard overview kearsipan
- Statistik peminjaman dan pengembalian
- Laporan dokumen yang overdue
- Export laporan ke berbagai format

### 🎨 Interface yang User-Friendly
- Design responsif untuk desktop, tablet, dan mobile
- Dark mode support untuk kenyamanan pengguna
- Navigasi intuitif dan mudah dipahami
- Toast notifications untuk feedback real-time

### 🔔 Notifikasi & Alert
- Alert untuk dokumen yang sudah waktunya dikembalikan
- Notifikasi peminjaman baru
- Reminder pengembalian dokumen

---

## 🛠️ Teknologi yang Digunakan

### Frontend Technology Stack
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 15.2.8 | React framework dengan SSR & SSG |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5 | Type-safe JavaScript |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Radix UI** | Latest | Unstyled, accessible components |
| **Lucide React** | 0.511.0 | Icon library |
| **next-themes** | 0.4.6 | Dark mode support |
| **Sonner** | 2.0.3 | Toast notifications |

### Backend & Database
| Teknologi | Fungsi |
|-----------|--------|
| **Supabase** | PostgreSQL database & authentication |
| **bcryptjs** | Password hashing & security |

### Development Tools
| Tool | Versi | Fungsi |
|------|-------|--------|
| **ESLint** | 9 | Code linting & quality |
| **Node.js** | 18+ | Runtime environment |

---

## 💻 Instalasi Lokal

### Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm**, **yarn**, **pnpm**, atau **bun** 
- **Git** ([Download](https://git-scm.com/))
- **Akun Supabase** (gratis di [supabase.com](https://supabase.com))
- **Code Editor** (VS Code, WebStorm, dll)

### Langkah-Langkah Instalasi

#### Step 1: Clone Repository

```bash
git clone https://github.com/rhyssh/SIRASIP.git
cd SIRASIP
```

#### Step 2: Install Dependencies

Pilih salah satu package manager:

```bash
# Menggunakan npm (recommended)
npm install

# atau menggunakan yarn
yarn install

# atau menggunakan pnpm
pnpm install

# atau menggunakan bun
bun install
```

**Proses ini akan menginstal semua dependency yang tercantum di `package.json`**

#### Step 3: Setup Supabase Project

1. **Buat Project Supabase**
   - Kunjungi [supabase.com](https://supabase.com)
   - Sign up atau login dengan akun Anda
   - Klik "New Project"
   - Isi nama project: `SIRASIP` atau nama lainnya
   - Atur region terdekat dengan lokasi Anda
   - Klik "Create new project"

2. **Ambil Credentials**
   - Tunggu hingga project selesai di-setup
   - Buka **Settings** → **API**
   - Copy **Project URL** dan **Anon Key** (public key)

#### Step 4: Konfigurasi Environment Variables

```bash
# Copy file template
cp .env.example .env.local
```

Buka file `.env.local` dan isi dengan kredensial Supabase:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Contoh:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 5: Setup Database Schema (Opsional)

Jika Anda perlu membuat struktur database, jalankan SQL migration di Supabase SQL Editor:

```sql
-- Tabel Users (handled by Supabase Auth)
-- Tabel Dokumen/Surat
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(255) UNIQUE NOT NULL,
  document_title VARCHAR(255) NOT NULL,
  document_type VARCHAR(100),
  category VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'available',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Peminjaman
CREATE TABLE borrowings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  borrowed_by UUID REFERENCES auth.users(id),
  borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NOT NULL,
  return_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'borrowed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;
```

---

## 🚀 Menjalankan Project

### Development Server

Jalankan development server dengan hot-reload dan Turbopack:

```bash
npm run dev
```

**Output:**
```
> tugas-zulham@0.1.0 dev
> next dev --turbopack

  ▲ Next.js 15.2.8
  - Local:        http://localhost:3000
```

Buka browser dan navigasi ke **[http://localhost:3000](http://localhost:3000)**

✅ Halaman akan otomatis refresh saat ada perubahan file  
✅ Turbopack memberikan fast refresh experience  
✅ TypeScript errors ditampilkan di browser  

### Production Build

Membuat optimized build untuk production:

```bash
# Build project
npm run build

# Jalankan production server
npm start
```

Server production akan berjalan di port 3000 (atau port yang tersedia).

---

## 📝 Script yang Tersedia

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server dengan Turbopack |
| `npm run build` | Buat production-ready build |
| `npm start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint untuk code quality checks |

**Contoh penggunaan:**
```bash
# Development
npm run dev

# Testing build sebelum deploy
npm run build && npm start

# Check code quality
npm run lint
```

---

## 📁 Struktur Project

```
SIRASIP/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── (auth)/                  # Auth pages group
│   │   ├── login/               # Login page
│   │   └── register/            # Register page
│   ├── (dashboard)/             # Dashboard pages
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── documents/          # Document management
│   │   ├── borrowings/         # Borrowing tracking
│   │   └── reports/            # Reports & analytics
│   └── api/                     # API routes (jika ada)
│
├── components/                   # Reusable React components
│   ├── ui/                      # Radix UI + Tailwind components
│   ├── layout/                  # Layout components
│   └── forms/                   # Form components
│
├── lib/                         # Utilities & helpers
│   ├── supabase/               # Supabase client setup
│   ├── auth/                   # Authentication logic
│   └── utils.ts                # Helper functions
│
├── public/                      # Static assets
│   ├── images/
│   └── icons/
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind directives
│
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── next.config.js               # Next.js config
└── README.md                    # Documentation
```

---

## 📖 Panduan Penggunaan

### Untuk Admin/Pengguna Awal

1. **Setup Database**
   - Setup schema database melalui Supabase SQL Editor
   - Konfigurasi Row Level Security (RLS) policies

2. **Login/Register**
   - Akses aplikasi di `http://localhost:3000`
   - Register akun baru atau login

3. **Konfigurasi User Roles**
   - Set roles di database (Admin, Petugas Arsip, User)
   - Configure RLS policies sesuai role

### Untuk Petugas Kearsipan

1. **Input Dokumen**
   - Menu "Dokumen" → "Tambah Dokumen"
   - Isi nomor surat, judul, kategori, deskripsi
   - Submit

2. **Catat Peminjaman**
   - Menu "Peminjaman" → "Catat Peminjaman Baru"
   - Pilih dokumen dan peminjam
   - Set tanggal pengembalian
   - Submit

3. **Verifikasi Pengembalian**
   - Monitor dokumen di status "Dipinjam"
   - Catat pengembalian dokumen
   - Update status menjadi "Dikembalikan"

### Untuk Pengguna Umum

1. **Lihat Dokumen Tersedia**
   - Dashboard → "Daftar Dokumen"
   - Cari dokumen berdasarkan kategori/nomor

2. **Ajukan Peminjaman**
   - Klik tombol "Pinjam" pada dokumen
   - Tentukan tanggal pengembalian
   - Submit permohonan

3. **Tracking Peminjaman**
   - Dashboard → "Peminjaman Saya"
   - Lihat status dan deadline pengembalian

---

## 🔧 Troubleshooting

### ❌ Port 3000 Sudah Digunakan

```bash
# Gunakan port berbeda
npm run dev -- -p 3001

# Atau kill process yang menggunakan port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ Environment Variables Tidak Terbaca

**Solusi:**
1. Pastikan file diberi nama `.env.local` (bukan `.env`)
2. Restart development server setelah mengubah `.env.local`
3. Variabel harus diawali dengan `NEXT_PUBLIC_` untuk client-side
4. Check di browser DevTools → Application → Environment

**Verifikasi:**
```javascript
// Di component
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### ❌ Dependency Conflicts

```bash
# Hapus node_modules dan lock file
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml

# Install ulang
npm install
```

### ❌ Supabase Connection Error

**Pastikan:**
1. ✅ Environment variables sudah benar
2. ✅ Supabase project aktif
3. ✅ Network connectivity baik
4. ✅ CORS policy ter-setup di Supabase

**Test connection:**
```bash
curl https://[your-project].supabase.co/rest/v1/
```

### ❌ Database Schema Errors

- Buka Supabase Dashboard → SQL Editor
- Verifikasi tabel sudah dibuat
- Check RLS policies
- Lihat error logs di dashboard

### ❌ Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

**Vercel adalah platform resmi untuk Next.js apps**

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Klik "New Project"
   - Import repository GitHub `rhyssh/SIRASIP`

3. **Configure Environment**
   - Di Vercel dashboard → Project Settings → Environment Variables
   - Tambahkan:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Deploy**
   - Vercel akan auto-detect Next.js
   - Klik "Deploy"
   - Tunggu hingga deployment selesai

**Live Demo**: [https://sirasip.vercel.app](https://sirasip.vercel.app)

### Deploy ke Alternatif Lain
- **Railway**: [railway.app](https://railway.app)
- **Netlify**: [netlify.com](https://netlify.com)
- **Digital Ocean**: [digitalocean.com](https://digitalocean.com)

---

## 🤝 Kontribusi

Kontribusi sangat dihargai! Untuk berkontribusi:

1. **Fork repository**
   ```bash
   git clone https://github.com/[username]/SIRASIP.git
   ```

2. **Buat branch feature**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: Deskripsi fitur baru"
   ```

4. **Push ke branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Buka Pull Request**
   - Jelaskan perubahan yang dilakukan
   - Link ke issue yang relevan

**Commit message conventions:**
- `Add:` - Fitur baru
- `Fix:` - Bug fix
- `Docs:` - Documentation
- `Style:` - Code style changes
- `Refactor:` - Code refactoring
- `Test:` - Test changes

---

## 📞 Support & Questions

Jika ada pertanyaan atau menemui masalah:

1. 📖 Cek [dokumentasi Next.js](https://nextjs.org/docs)
2. 💬 Buka [GitHub Issues](https://github.com/rhyssh/SIRASIP/issues)
3. 📧 Hubungi developer melalui GitHub profile

---

## 📄 License

Project ini bersifat **private** dan dimiliki oleh [rhyssh](https://github.com/rhyssh).

---

## 👨‍💼 Project Information

| Aspek | Detail |
|-------|--------|
| **Project Name** | SIRASIP (Sistem Kearsipan) |
| **Owner** | [rhyssh](https://github.com/rhyssh) |
| **Repository** | [github.com/rhyssh/SIRASIP](https://github.com/rhyssh/SIRASIP) |
| **Live Demo** | [sirasip.vercel.app](https://sirasip.vercel.app) |
| **Status** | Active Development |
| **Last Updated** | 2026-04-22 |

---

<div align="center">

**Made with ❤️ for better document management in Indonesian Institutions**

[⬆ Kembali ke Atas](#sirasip---sistem-kearsipan)

</div>
