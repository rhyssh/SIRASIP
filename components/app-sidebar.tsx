/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Building2, LayoutDashboard, FileText, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
interface User {
  id: string
  name: string
  email: string
  role: string
}

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "staff"],
    },
    {
      title: "Kelola Peminjaman",
      url: "/dashboard/borrowship",
      icon: FileText,
      roles: ["admin", "staff"],
    },
    {
      title: "Kelola Pengguna",
      url: "/dashboard/users",
      icon: Users,
      roles: ["admin"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => user?.role && item.roles.includes(user.role))

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
            <Image src={"/logo.png"} alt="logo" width={32} height={32} className="h-8 w-8"></Image>
          <div>
            <h2 className="font-semibold text-slate-900">SIRASIP</h2>
            <p className="text-xs text-slate-500">Biro Umum Sekretariat Daerah Provinsi Jawa Tengah</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 py-2">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="h-10">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <div className="text-xs text-slate-500 text-center">
          <p>Sistem Kearsipan v1.0</p>
          <p>© 2024 Pemprov Jateng</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
