"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Sistem Persuratan & Kearsipan</h1>
            </div>
            <ProfileDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-50">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
