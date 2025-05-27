import { getSupabaseClient } from "./supabase-client";
import type { User, BorrowRecord } from "./supabase";
import bcrypt from "bcryptjs";

interface Activity {
  id: string
  user_id?: string
  peminjam: string
  jumlah_berkas: number
  nomor_berkas: string
  nama_berkas: string
  tanggal_peminjam: string
  tanggal_kembali: string
  tanggal_dikembalikan?: string
  petugas?: string
  keterangan?: string
  status: string
  created_at: string
  updated_at: string
}
// User operations
export async function getUsers(): Promise<User[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as User[];
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseClient();

  // Hash password dulu sebelum insert
  const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 = salt rounds

  // Insert data ke DB dengan password yang sudah di-hash
  const { data, error } = await supabase
    .from("users")
    .insert([{ ...userData, password: hashedPassword }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, userData: Partial<User>) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(id: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
}

// Borrowship operations
export async function getBorrowRecords(): Promise<BorrowRecord[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("borrowship").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as BorrowRecord[]; ;
}

export async function createBorrowRecord(recordData: Omit<BorrowRecord, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("borrowship").insert([recordData]).select().single();

  if (error) throw error;
  return data;
}

export async function updateBorrowRecord(id: string, recordData: Partial<BorrowRecord>) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("borrowship")
    .update({ ...recordData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBorrowRecord(id: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("borrowship").delete().eq("id", id);

  if (error) throw error;
}

// Dashboard statistics
export async function getDashboardStats() {
  const supabase = getSupabaseClient();

  const [{ count: totalDocuments }, { count: activeBorrows }, { count: totalUsers }, { data: todayReturns }] = await Promise.all([
    supabase.from("borrowship").select("*", { count: "exact", head: true }),
    supabase.from("borrowship").select("*", { count: "exact", head: true }).eq("status", "aktif"),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("borrowship").select("*").eq("tanggal_dikembalikan", new Date().toISOString().split("T")[0]),
  ]);

  return {
    totalDocuments: totalDocuments || 0,
    activeBorrows: activeBorrows || 0,
    totalUsers: totalUsers || 0,
    todayReturns: todayReturns?.length || 0,
  };
}

// Ambil 5 aktivitas terbaru dari tabel 'borrowship'
export async function getRecentActivities(): Promise<Activity[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("borrowship")
    .select("*")
    .returns<Activity[]>(); // 👈 Supabase type assertion

  if (error) throw error;
  return data ?? [];
}


// Ambil daftar dokumen yang lewat tanggal kembali
export async function getOverdueBorrows(): Promise<Activity[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("borrowship")
    .select("*")
    .gt("tanggal_dikembalikan", "tanggal_kembali")
    .eq("status", "aktif")
    .returns<Activity[]>();

  if (error) throw error;
  return data ?? [];
}
