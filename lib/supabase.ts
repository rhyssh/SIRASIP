import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  password: string
  phone?: string
  department?: string
  address?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface BorrowRecord {
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
