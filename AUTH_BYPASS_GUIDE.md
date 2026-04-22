# 🔐 Authentication Bypass & Dummy Data Guide

## Overview

Aplikasi sekarang memiliki **mode dummy/testing** untuk development tanpa memerlukan database atau verifikasi password yang ketat.

---

## 🚀 Cara Login dengan Dummy Data

### Akun Dummy yang Tersedia:

#### 1. **Admin Account**

```
Email: admin@jatengprov.go.id
Password: admin123
Role: admin
```

#### 2. **Staff Account**

```
Email: staff@jatengprov.go.id
Password: staff123
Role: staff
```

#### 3. **Akun Fleksibel (Master Password)**

```
Email: [email apapun]@jatengprov.go.id
Password: dev
```

Dengan master password `dev`, Anda bisa login dengan email apapun untuk testing berbagai skenario.

---

## 📝 Konfigurasi Dummy Users

File: `lib/auth.ts`

Dummy users didefinisikan di variabel `DUMMY_USERS`:

```typescript
const DUMMY_USERS = {
  admin: {
    id: "dummy-admin-001",
    user_id: "admin-001",
    name: "Admin User",
    email: "admin@jatengprov.go.id",
    password: "admin123",
    role: "admin",
    status: "aktif",
    department: "Sistem Informasi",
  },
  staff: {
    id: "dummy-staff-001",
    user_id: "staff-001",
    name: "Petugas Kearsipan",
    email: "staff@jatengprov.go.id",
    password: "staff123",
    role: "staff",
    status: "aktif",
    department: "Kearsipan",
  },
};
```

**Untuk menambah dummy user baru:**

1. Edit `lib/auth.ts`
2. Tambahkan entry baru di `DUMMY_USERS`
3. Set email, password, role, dan data lainnya

---

## 🔄 Switching antara Development dan Production Mode

### Mode Development (Sekarang Aktif)

**File:** `app/login/page.tsx`

Saat ini menggunakan `dummyLogin()` yang tidak memerlukan database:

```typescript
await dummyLogin(email, password);
```

### Mode Production (Database Real)

Untuk switch ke production dengan database real, ubah:

**File:** `app/login/page.tsx` (baris ~25)

```typescript
// Ganti ini:
await dummyLogin(email, password);

// Menjadi:
await signIn(email, password);
```

---

## 🛠️ Implementasi Detail

### Fungsi `dummyLogin()`

- **Lokasi:** `lib/auth.ts`
- **Fungsi:** Mencari user dari `DUMMY_USERS` berdasarkan email
- **Validasi Password:**
  - Bisa gunakan password spesifik dari akun (contoh: `admin123`)
  - Atau gunakan master password `dev` untuk semua akun
- **Simpan Session:** User data disimpan ke `localStorage` setelah login berhasil

### Fungsi `signIn()` (Production)

- **Lokasi:** `lib/auth.ts`
- **Fungsi:** Verifikasi ke database Supabase dengan bcrypt validation
- **Gunakan:** Ketika sudah siap dengan database real

---

## 📊 User Data yang Disimpan

Setelah login berhasil, user data tersimpan di localStorage dengan struktur:

```typescript
interface user {
  id: string; // ID unik user
  user_id: string; // User ID
  name: string; // Nama lengkap
  email: string; // Email
  password: string; // Password (simpan di localStorage saja untuk dummy)
  role: string; // Role (admin, staff, dll)
  status: string; // Status (aktif)
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
  department: string; // Departemen
}
```

Akses user saat ini:

```typescript
import { getCurrentUser } from "@/lib/auth";

const user = await getCurrentUser();
console.log(user.name, user.role);
```

---

## 🔓 Bypass Rules

| Input                                 | Output           | Catatan                                                          |
| ------------------------------------- | ---------------- | ---------------------------------------------------------------- |
| `admin@jatengprov.go.id` + `admin123` | ✅ Login Admin   | Password spesifik                                                |
| `staff@jatengprov.go.id` + `staff123` | ✅ Login Staff   | Password spesifik                                                |
| `any@jatengprov.go.id` + `dev`        | ✅ Master Bypass | Password universal                                               |
| `unknown@example.com` + `dev`         | ❌ Error         | Email harus di dummy users atau gunakan email pattern yang benar |

---

## 🔒 Logout & Session Management

```typescript
import { signOut } from "@/lib/auth";

// Logout
signOut();

// Clear localStorage
localStorage.removeItem("user");
```

---

## ⚠️ Catatan Penting

1. **Development Mode**: Tidak ada validasi database, password tidak di-hash dengan bcrypt
2. **Production Mode**: Pastikan ubah `dummyLogin()` ke `signIn()` sebelum deploy
3. **Security**: Jangan pernah gunakan master password `dev` di production
4. **localStorage**: User data di localStorage bukan secure untuk production (gunakan cookies/session)

---

## 🚀 Next Steps (Ketika Production Ready)

1. **Migrasi ke Supabase Auth**:
   - Setup database users dengan password ter-hash
   - Update `signIn()` function dengan schema database real

2. **Add Session/Cookie Management**:
   - Ganti localStorage dengan secure cookies
   - Implement refresh tokens

3. **Remove Dummy Users**:
   - Hapus `dummyLogin()` function
   - Hapus `DUMMY_USERS` object
   - Update login page instructions

4. **Add Rate Limiting & Security**:
   - Implement failed login attempts limit
   - Add email verification
   - Add password reset flow

---

## 🐛 Troubleshooting

**Q: Tidak bisa login dengan email dummy?**

- Pastikan email format benar: `admin@jatengprov.go.id`
- Cek password: gunakan `admin123`, `staff123`, atau `dev`

**Q: User data tidak tersimpan?**

- Cek localStorage di DevTools (F12 → Application → localStorage)
- Pastikan tidak ada error di console

**Q: Ingin menambah dummy user baru?**

- Edit `lib/auth.ts` → `DUMMY_USERS` object
- Tambah entry baru dengan struktur user

---

## 📞 Contact & Support

Dokumentasi ini akan diupdate seiring development aplikasi berlanjut.
