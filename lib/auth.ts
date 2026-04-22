import { getSupabaseClient } from "./supabase-client";
import type { User } from "./supabase";
import bcrypt from "bcryptjs";

interface user {
  id: string;
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  department: string;
}

// Dummy user data untuk development/testing
const DUMMY_USERS = {
  admin: {
    id: "dummy-admin-001",
    user_id: "admin-001",
    name: "Admin User",
    email: "admin@jatengprov.go.id",
    password: "admin123", // Password dummy, tidak divalidasi dengan bcrypt
    role: "admin",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Kearsipan",
  },
};

// Mode development: Login dengan dummy data tanpa verifikasi database
export async function dummyLogin(email: string, password: string): Promise<User> {
  // Cari user dari dummy data berdasarkan email
  const dummyUser = Object.values(DUMMY_USERS).find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (!dummyUser) {
    throw new Error("Email tidak ditemukan. Gunakan: admin@jatengprov.go.id atau staff@jatengprov.go.id");
  }

  // Untuk dummy login, tidak perlu verifikasi password yang ketat
  // Bisa langsung login dengan email apapun
  // Atau bisa periksa password dummy yang sudah ditetapkan
  if (password !== dummyUser.password && password !== "dev") {
    throw new Error("Password salah. Gunakan: admin123, staff123, atau 'dev' untuk semua akun");
  }

  // Simpan user ke localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(dummyUser));
  }

  return dummyUser as unknown as User;
}

export async function signIn(email: string, password: string): Promise<User> {
  const supabase = getSupabaseClient();

  const { data: user, error } = await supabase.from("users").select("*").eq("email", email.trim()).eq("status", "aktif").single();
  if (error || !user) {
    console.error(error);
    throw new Error("Email tidak ditemukan atau akun tidak aktif", { cause: error });
  }
  if (typeof user.password !== "string") {
    throw new Error("Password user tidak valid");
  }

  // Cek password pakai bcrypt compare
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Kata sandi salah");
  }

  // Simpan user ke localStorage (bisa juga di session atau cookie sesuai kebutuhan)
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user as unknown as user;
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}
