"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message || "Gagal masuk, coba lagi");
      } else {
        setErrorMsg("Gagal masuk, coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sistem Kearsipan</h1>
          <p className="text-slate-600">Pemerintah Provinsi Jawa Tengah</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-center">Masukkan email dan kata sandi untuk mengakses sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@jatengprov.go.id" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input id="password" type="password" placeholder="Masukkan kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" disabled={isLoading} />
              </div>

              {errorMsg && <p className="text-red-600 text-center text-sm">{errorMsg}</p>}

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {/* <p>Demo: gunakan email dengan "admin" untuk akses admin</p>
              <p>Contoh: admin@jatengprov.go.id</p> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
