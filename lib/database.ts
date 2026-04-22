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

// 🎯 DUMMY DATA untuk Development/Testing
const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: "dummy-1",
    peminjam: "Dinas Pendidikan",
    jumlah_berkas: 5,
    nomor_berkas: "DOC-2024-001",
    nama_berkas: "Laporan Tahunan 2023",
    tanggal_peminjam: "2024-04-15",
    tanggal_kembali: "2024-04-22",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dummy-2",
    peminjam: "Dinas Kesehatan",
    jumlah_berkas: 3,
    nomor_berkas: "DOC-2024-002",
    nama_berkas: "Data Epidemiologi",
    tanggal_peminjam: "2024-04-18",
    tanggal_kembali: "2024-04-25",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dummy-3",
    peminjam: "Dinas PUPR",
    jumlah_berkas: 2,
    nomor_berkas: "DOC-2024-003",
    nama_berkas: "Dokumen Proyek Infrastruktur",
    tanggal_peminjam: "2024-04-10",
    tanggal_kembali: "2024-04-20",
    tanggal_dikembalikan: "2024-04-20",
    status: "dikembalikan",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DUMMY_OVERDUE: Activity[] = [
  {
    id: "dummy-overdue-1",
    peminjam: "Dinas Pariwisata",
    jumlah_berkas: 4,
    nomor_berkas: "DOC-2024-004",
    nama_berkas: "Statistik Pariwisata 2023",
    tanggal_peminjam: "2024-04-05",
    tanggal_kembali: "2024-04-10",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Dummy Users
const DUMMY_USERS_DATA: User[] = [
  {
    id: "dummy-user-1",
    user_id: "U001",
    name: "Admin User",
    email: "admin@jatengprov.go.id",
    password: "hashed_admin123",
    role: "admin",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Sistem Informasi",
  },
  {
    id: "dummy-user-2",
    user_id: "U002",
    name: "Petugas Kearsipan",
    email: "staff@jatengprov.go.id",
    password: "hashed_staff123",
    role: "staff",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Kearsipan",
  },
];

// Dummy Borrow Records
const DUMMY_BORROW_RECORDS: BorrowRecord[] = [
  {
    id: "borrow-1",
    jumlah_berkas: 5,
    nomor_berkas: "DOC-2024-001",
    nama_berkas: "Laporan Tahunan 2023",
    tanggal_peminjam: "2024-04-15",
    tanggal_kembali: "2024-04-22",
    petugas: "Admin User",
    keterangan: "Peminjaman reguler",
    peminjam: "Dinas Pendidikan",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "borrow-2",
    jumlah_berkas: 3,
    nomor_berkas: "DOC-2024-002",
    nama_berkas: "Data Epidemiologi",
    tanggal_peminjam: "2024-04-18",
    tanggal_kembali: "2024-04-25",
    petugas: "Petugas Kearsipan",
    keterangan: "Peminjaman untuk rapat",
    peminjam: "Dinas Kesehatan",
    status: "aktif",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
// User operations
export async function getUsers(): Promise<User[]> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as User[];
  } catch (error) {
    console.warn("⚠️ Error mengambil users, menggunakan dummy data", error);
    return DUMMY_USERS_DATA;
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">) {
  try {
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
  } catch (error) {
    console.error("⚠️ Error creating user:", error);
    throw new Error("Gagal membuat user. Gunakan dummy data untuk testing.");
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("users")
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("⚠️ Error updating user:", error);
    throw new Error("Gagal update user.");
  }
}

export async function deleteUser(id: string) {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("⚠️ Error deleting user:", error);
    throw new Error("Gagal hapus user.");
  }
}

// Borrowship operations
export async function getBorrowRecords(): Promise<BorrowRecord[]> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("borrowship").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as BorrowRecord[];
  } catch (error) {
    console.warn("⚠️ Error mengambil borrow records, menggunakan dummy data", error);
    return DUMMY_BORROW_RECORDS;
  }
}

export async function createBorrowRecord(recordData: Omit<BorrowRecord, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("borrowship").insert([recordData]).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("⚠️ Error creating borrow record:", error);
    throw new Error("Gagal membuat peminjaman. Gunakan dummy data untuk testing.");
  }
}

export async function updateBorrowRecord(id: string, recordData: Partial<BorrowRecord>) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("borrowship")
      .update({ ...recordData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("⚠️ Error updating borrow record:", error);
    throw new Error("Gagal update peminjaman.");
  }
}

export async function deleteBorrowRecord(id: string) {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("borrowship").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("⚠️ Error deleting borrow record:", error);
    throw new Error("Gagal hapus peminjaman.");
  }
}

// Dashboard statistics
export async function getDashboardStats() {
  try {
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
  } catch (error) {
    // Fallback ke dummy data jika Supabase error
    console.warn("⚠️ Database error, menggunakan dummy data", error);
    return {
      totalDocuments: DUMMY_ACTIVITIES.length,
      activeBorrows: DUMMY_ACTIVITIES.filter(a => a.status === "aktif").length,
      totalUsers: 5,
      todayReturns: 1,
    };
  }
}

// Ambil 5 aktivitas terbaru dari tabel 'borrowship'
export async function getRecentActivities(): Promise<Activity[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("borrowship")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<Activity[]>();

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    // Fallback ke dummy data jika error
    console.warn("⚠️ Error mengambil aktivitas, menggunakan dummy data", error);
    return DUMMY_ACTIVITIES;
  }
}

// Ambil daftar dokumen yang lewat tanggal kembali
export async function getOverdueBorrows(): Promise<Activity[]> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("overdue_borrowship")
      .select("*")
      .returns<Activity[]>();

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    // Fallback ke dummy data jika error
    console.warn("⚠️ Error mengambil data overdue, menggunakan dummy data", error);
    return DUMMY_OVERDUE;
  }
}

