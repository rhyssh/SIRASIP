"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getRecentActivities, getOverdueBorrows } from "@/lib/database";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle } from "lucide-react";

interface User {
  id: string
  user_id?: string
  name: string
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

interface Overdue {
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeBorrows: 0,
    todayReturns: 0,
    totalUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [overdueDocs, setOverdueDocs] = useState<Overdue[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Ambil data statistik dari Supabase
    const fetchStats = async () => {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    };

    fetchStats();

    const fetchMoreData = async () => {
      const [activities, overdues] = await Promise.all([getRecentActivities(), getOverdueBorrows()]);
      setRecentActivities(activities );
      setOverdueDocs(overdues);
    };

    fetchMoreData();
  },[]);

  const status = (status: string) => {
    switch (status) {
      case "aktif":
        return "Peminjaman";
      case "dikembalikan":
        return "Pengembalian";
      case "terlambat":
        return "Terlambat";
      default:
        return "tidak diketahui";
    }
  };

  const cards = [
    {
      title: "Total Dokumen",
      value: stats.totalDocuments.toLocaleString(),
      description: "Dokumen dalam sistem",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Peminjaman Aktif",
      value: stats.activeBorrows.toLocaleString(),
      description: "Sedang dipinjam",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Dikembalikan Hari Ini",
      value: stats.todayReturns.toLocaleString(),
      description: "Pengembalian hari ini",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Total Pengguna",
      value: stats.totalUsers.toLocaleString(),
      description: "Pengguna terdaftar",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Selamat datang, {user?.name}. Berikut adalah ringkasan sistem kearsipan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            <CardDescription>Peminjaman dan pengembalian terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {status(activity.status)} - {activity.nama_berkas}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-xs text-slate-500">oleh {activity.peminjam}</p>
                      <span className="text-xs text-slate-500">|</span>
                      <p className="text-xs text-slate-500">petugas {activity.petugas}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(activity.updated_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dokumen Terlambat</CardTitle>
            <CardDescription>Peminjaman yang melewati batas waktu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueDocs.map((doc, index) => {
                // const overdueDays = Math.floor((new Date().getTime() - new Date(doc.tanggal_dikembalikan).getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      {/* <p className="text-sm font-medium text-slate-900">{doc.nomor_berkas}</p>
                      <p className="text-xs text-slate-500">Peminjam: {doc.peminjam}</p> */}
                    </div>
                    {/* <span className="text-xs text-red-600 font-medium">Terlambat {overdueDays} hari</span> */}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
