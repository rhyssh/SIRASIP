/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, User, Mail, Upload } from "lucide-react";

type UserProfile = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  profileImage: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileForm({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        department: parsedUser.department || "",
      });
      setProfileImage(parsedUser.profileImage || null);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      // In a real app, this would update the database via Supabase
      const updatedUser = {
        id: user?.id,
        role: user?.role,
        ...profileForm,
        profileImage,
      };

      // Update localStorage for demo
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser as UserProfile);

      try {
        // kode update profile
        setUser(updatedUser as UserProfile);
        toast("Profil berhasil diperbarui");
      } catch (error) {
        console.error("Gagal update profile", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Administrator" : "Pengguna";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Memuat profil...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profil Saya</h2>
        <p className="text-slate-600">Kelola informasi akun dan preferensi Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Foto Profil</CardTitle>
            <CardDescription>Unggah foto profil Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                {profileImage ? <AvatarImage src={profileImage || "/placeholder.svg"} alt={user.name} /> : <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">{getInitials(user.name)}</AvatarFallback>}
              </Avatar>

              <div className="text-center">
                <h3 className="font-semibold text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{getRoleLabel(user.role)}</Badge>
              </div>

              <div className="w-full">
                <input type="file" id="profile-image" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button variant="outline" className="w-full" onClick={() => document.getElementById("profile-image")?.click()}>
                  <Camera className="mr-2 h-4 w-4" />
                  Ubah Foto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informasi Akun</CardTitle>
              <CardDescription>Perbarui informasi dasar akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input id="name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Masukkan nama lengkap" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input id="email" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="nama@jatengprov.go.id" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Masukkan nomor telepon" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Input id="department" value={profileForm.department} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })} placeholder="Masukkan departemen" />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Security Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Keamanan Akun</CardTitle>
              <CardDescription>Kelola keamanan dan akses akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Kata Sandi</h4>
                  <p className="text-sm text-slate-500">Terakhir diubah 30 hari yang lalu</p>
                </div>
                <Button variant="outline" size="sm">
                  Ubah Kata Sandi
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Autentikasi Dua Faktor</h4>
                  <p className="text-sm text-slate-500">Tambahkan lapisan keamanan ekstra</p>
                </div>
                <Button variant="outline" size="sm">
                  Aktifkan
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Sesi Aktif</h4>
                  <p className="text-sm text-slate-500">Kelola perangkat yang terhubung</p>
                </div>
                <Button variant="outline" size="sm">
                  Lihat Sesi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
