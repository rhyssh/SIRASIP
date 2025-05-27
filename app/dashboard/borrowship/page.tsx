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
import { Plus, Search, FileText, Calendar, User } from "lucide-react";
import { getBorrowRecords, updateBorrowRecord, deleteBorrowRecord, createBorrowRecord } from "@/lib/database";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
interface BorrowRecord {
  id: string;
  jumlah_berkas: number;
  nomor_berkas: string;
  nama_berkas: string;
  tanggal_peminjam: string;
  tanggal_kembali: string;
  tanggal_dikembalikan?: string;
  petugas: string;
  keterangan: string;
  peminjam: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  // tambahkan properti lain kalau ada
}

function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== "" && v !== undefined)
  ) as Partial<T>;
}

export default function BorrowshipPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BorrowRecord | null>(null);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 2;
  const [editForm, setEditForm] = useState({
    peminjam: "",
    nomor_berkas: "",
    nama_berkas: "",
    jumlah_berkas: 1,
    tanggal_peminjam: "",
    tanggal_kembali: "",
    tanggal_dikembalikan: "",
    keterangan: "",
    petugas: "",
    status: "",
  });

  const [newForm, setNewForm] = useState({
    peminjam: "",
    nomor_berkas: "",
    nama_berkas: "",
    jumlah_berkas: 1,
    tanggal_peminjam: "",
    tanggal_kembali: "",
    keterangan: "",
    petugas: "",
    status: "",
  });

  const handleEditRecord = (record: BorrowRecord) => {
    setEditingRecord(record);
    setEditForm({
      peminjam: record.peminjam,
      nomor_berkas: record.nomor_berkas,
      nama_berkas: record.nama_berkas,
      jumlah_berkas: record.jumlah_berkas,
      tanggal_peminjam: record.tanggal_peminjam,
      tanggal_kembali: record.tanggal_kembali,
      tanggal_dikembalikan: record.tanggal_dikembalikan ?? "",
      keterangan: record.keterangan,
      petugas: record.petugas,
      status: record.status,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Yakin mau hapus peminjaman ini?")) return;
    try {
      await deleteBorrowRecord(recordId);
      setBorrowRecords((prev) => prev.filter((r) => r.id !== recordId));
    } catch (error) {
      console.error("Gagal hapus data", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    setIsLoading(true);
    const cleanedForm = cleanObject(editForm);
    try {
      const updated = await updateBorrowRecord(editingRecord.id, cleanedForm);
      setBorrowRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r) as BorrowRecord));
      toast.success("Data berhasil diperbarui");
      setEditDialogOpen(false);
      setEditingRecord(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Gagal update data", error);
      toast.error("Gagal update data");
    }
  };

  const handleSaveNew = async () => {
    setIsLoading(true);
    try {
      if (!newForm.tanggal_peminjam) {
        newForm.tanggal_peminjam = new Date().toISOString().split("T")[0];
      }
      const recordToInsert = {
        ...newForm,
        tanggal_peminjam: newForm.tanggal_peminjam,
        tanggal_kembali: newForm.tanggal_kembali || null,
        petugas: currentUser?.name || "", // <<== INI
      };

      const created = await createBorrowRecord(recordToInsert as Omit<BorrowRecord, "id" | "created_at" | "updated_at">);
      setBorrowRecords((prev) => [created, ...prev] as BorrowRecord[]);
      setNewForm({
        peminjam: "",
        nomor_berkas: "",
        nama_berkas: "",
        jumlah_berkas: 1,
        tanggal_peminjam: new Date().toISOString().split("T")[0],
        tanggal_kembali: "",
        keterangan: "",
        petugas: "",
        status: "aktif",
      });
      toast.success("Berhasil simpan data");
      setIsLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Gagal simpan data");
      console.error("Gagal tambah data", error);
    }
  };

  // Filter records untuk search
  const filteredRecords = borrowRecords.filter(
    (record) =>
      (record.petugas || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.nomor_berkas || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.peminjam || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.keterangan || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Aktif</Badge>;
      case "dikembalikan":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Dikembalikan</Badge>;
      case "terlambat":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Terlambat</Badge>;
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

  // Fetch data dari Supabase saat halaman load
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
    async function fetchRecords() {
      // setLoading(true);
      try {
        const data = await getBorrowRecords();
        setBorrowRecords(data as BorrowRecord[]);
      } catch (error) {
        console.error("Gagal ambil data peminjaman", error);
      }
      // setLoading(false);
    }
    fetchRecords();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kelola Peminjaman</h2>
          <p className="text-slate-600">Daftar peminjaman dokumen arsip</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Peminjaman
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Peminjaman Baru</DialogTitle>
              <DialogDescription>Masukkan detail peminjaman dokumen arsip</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="peminjam">Nama Peminjam</Label>
                <Input id="peminjam" placeholder="Masukkan nama peminjam" onChange={(e) => setNewForm({ ...newForm, peminjam: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nomor_berkas">Nomor Berkas</Label>
                <Input id="nomor_berkas" placeholder="Contoh: SK-001/2024, MOU-002/2024" onChange={(e) => setNewForm({ ...newForm, nomor_berkas: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nama_berkas">Nama Berkas</Label>
                <Input id="nama_berkas" placeholder="Contoh: Surat Keterangan, Memo Organisasi" onChange={(e) => setNewForm({ ...newForm, nama_berkas: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jumlah_berkas">Jumlah Berkas</Label>
                <Input id="jumlah_berkas" type="number" min={1} placeholder="Masukkan jumlah berkas" onChange={(e) => setNewForm({ ...newForm, jumlah_berkas: parseInt(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggal_peminjam">Tanggal peminjam</Label>
                <Input id="tanggal_peminjam" type="date" onChange={(e) => setNewForm({ ...newForm, tanggal_peminjam: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggal_kembali">Tanggal Kembali</Label>
                <Input id="tanggal_kembali" type="date" onChange={(e) => setNewForm({ ...newForm, tanggal_kembali: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nama_petugas">Nama Petugas</Label>
                <Input id="nama_petugas" type="text" disabled value={currentUser?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="aktif" onValueChange={(e) => setNewForm({ ...newForm, status: e })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
                    <SelectItem value="terlambat">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Select  onValueChange={(e) => setNewForm({ ...newForm, keterangan: e })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih keterangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="eksternal">Eksternal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSaveNew()} disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Peminjaman</DialogTitle>
              <DialogDescription>Ubah detail peminjaman dokumen arsip</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-peminjam">Nama Peminjam</Label>
                <Input id="edit-peminjam" value={editForm.peminjam} onChange={(e) => setEditForm({ ...editForm, peminjam: e.target.value })} placeholder="Masukkan nama peminjam" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-nomor_berkas">Nomor Berkas</Label>
                <Input id="edit-nomor_berkas" value={editForm.nomor_berkas} onChange={(e) => setEditForm({ ...editForm, nomor_berkas: e.target.value })} placeholder="Contoh: SK-001/2024, MOU-002/2024" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-nama_berkas">Nama Berkas</Label>
                <Input id="edit-nama_berkas" value={editForm.nama_berkas} onChange={(e) => setEditForm({ ...editForm, nama_berkas: e.target.value })} placeholder="Contoh: Surat Keputusan, Memorandum of Understanding" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-jumlah_berkas">Jumlah Berkas</Label>
                <Input id="edit-jumlah_berkas" type="number" min={1} value={editForm.jumlah_berkas} onChange={(e) => setEditForm({ ...editForm, jumlah_berkas: Number.parseInt(e.target.value) || 1 })} placeholder="Masukkan jumlah berkas" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tanggal_kembali">Tanggal Kembali</Label>
                <Input id="edit-tanggal_kembali" type="date" value={editForm.tanggal_kembali} onChange={(e) => setEditForm({ ...editForm, tanggal_kembali: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tanggal_dikembalikan">Tanggal dikembalikan</Label>
                <Input id="edit-tanggal_dikembalikan" type="date" value={editForm.tanggal_dikembalikan} onChange={(e) => setEditForm({ ...editForm, tanggal_dikembalikan: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-petugas">Nama Petugas</Label>
                <Input id="edit-petugas" value={editForm.petugas} onChange={(e) => setEditForm({ ...editForm, petugas: e.target.value })} placeholder="Masukkan Petugas" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(e) => setEditForm({ ...editForm, status: e as "aktif" | "dikembalikan" | "terlambat" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
                    <SelectItem value="terlambat">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-keterangan">Keterangan</Label>
                <Select value={editForm.keterangan} onValueChange={(e) => setEditForm({ ...editForm, keterangan: e })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih keterangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="eksternal">Eksternal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? "Loading...": "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Peminjaman </CardTitle>
              <CardDescription>Kelola data peminjaman dokumen arsip</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Cari berkas atau peminjam..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Peminjam</TableHead>
                  <TableHead className="font-semibold">Jumlah Berkas</TableHead>
                  <TableHead className="font-semibold">Nomor Berkas</TableHead>
                  <TableHead className="font-semibold">Nama Berkas</TableHead>
                  <TableHead className="font-semibold">Tanggal Pinjam</TableHead>
                  <TableHead className="font-semibold">Tanggal Kembali</TableHead>
                  <TableHead className="font-semibold">Tanggal dikembalikan</TableHead>
                  <TableHead className="font-semibold">Petugas</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Keterangan</TableHead>
                  <TableHead className="font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="font-medium">{record.peminjam}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span>{record.jumlah_berkas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={record.nomor_berkas}>
                          {record.nomor_berkas}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={record.nama_berkas}>
                          {record.nama_berkas}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{formatDate(record.tanggal_peminjam)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{formatDate(record.tanggal_kembali)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{record.tanggal_dikembalikan ? formatDate(record.tanggal_dikembalikan) : "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-slate-100 px-2 py-1 rounded text-center text-sm font-mono">{record.petugas}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 truncate" title={record.keterangan}>
                          {record.keterangan}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRecord(record)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteRecord(record.id)}>
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-600">
                Menampilkan {Math.min(filteredRecords.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(currentPage * itemsPerPage, filteredRecords.length)} dari {filteredRecords.length} data
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  Sebelumnya
                </Button>
                <span className="text-sm text-slate-700">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-slate-500">{searchTerm ? "Tidak ditemukan hasil pencarian" : "Belum ada data peminjaman"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
