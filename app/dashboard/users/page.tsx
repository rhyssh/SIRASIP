/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Shield, UsersIcon, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createUser, updateUser, deleteUser } from "@/lib/database";

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface user{
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });
  const [newForm, setNewForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    password: "",
  });

  useEffect(() => {
    const currUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    currUser();
    const fetchUsers = async () => {
      try {
        const { getUsers } = await import("@/lib/database"); // atau path relatif `../../../../lib/database` sesuai struktur
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Gagal mengambil data users", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Administrator</Badge>;
      case "staff":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Staff</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>;
      case "nonaktif":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Nonaktif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditUser = (user: UserInterface) => {

    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const { updateUser } = await import("@/lib/database");
      if (editingUser) {
        await updateUser(editingUser.id, editForm);
        // refetch users
        const { getUsers } = await import("@/lib/database");
        const data = await getUsers();
        setUsers(data);
      }
      setIsLoading(false);
      setEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Gagal update user", error);
    }
  };

  const handleSaveNew = async () => {
    setIsLoading(true);
    if (!newForm.name || !newForm.email || !newForm.password || !newForm.role || !newForm.status) {
      alert("Mohon lengkapi semua data termasuk role dan status.");
      return;
    }
    try {
      const created = await createUser(newForm);
      setUsers((prev) => [created, ...prev] as UserInterface[]);
      setIsLoading(false);
      setIsDialogOpen(false);
      setNewForm({
        name: "",
        email: "",
        role: "",
        status: "",
        password: "",
      });
    } catch (error) {
      console.error("Gagal tambah data", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Yakin mau hapus user ini?")) return;
    try {
      const { deleteUser } = await import("@/lib/database");
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Gagal hapus data", error);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Akses Terbatas</h3>
          <p className="mt-1 text-sm text-slate-500">Anda tidak memiliki akses ke halaman ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kelola Pengguna</h2>
          <p className="text-slate-600">Manajemen pengguna sistem kearsipan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>Masukkan detail pengguna baru sistem</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama lengkap" onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@jatengprov.go.id" onChange={(e) => setNewForm({ ...newForm, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Status</Label>
                <Select onValueChange={(value) => setNewForm({ ...newForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="staff" onValueChange={(value) => setNewForm({ ...newForm, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" value={newForm.password} onChange={(e) => setNewForm({ ...newForm, password: e.target.value })} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveNew} disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
              <CardDescription>Kelola akun pengguna sistem</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Pengguna</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Tanggal Dibuat</TableHead>
                  <TableHead className="font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <Shield className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.email}</span>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(user.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <UsersIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-slate-500">{searchTerm ? "Tidak ditemukan hasil pencarian" : "Belum ada data pengguna"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Ubah detail pengguna sistem</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Masukkan nama lengkap" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="nama@jatengprov.go.id" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editForm.role} defaultValue={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? "Loading..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
