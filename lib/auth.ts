import { getSupabaseClient } from "./supabase-client";
import type { User } from "./supabase";
import bcrypt from "bcryptjs";

interface user{
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
export async function signIn(email: string, password: string): Promise<User> {
  const supabase = getSupabaseClient();
  console.log(email, password);
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.trim())
    .eq("status", "aktif")
    .single();
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

  return user as unknown as user ;
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
