"use client"

import * as React from "react"
import { toast as sonnerToast, Toaster } from "sonner"

function useToast() {
  // Fungsi untuk menampilkan toast dengan pesan string
  const toast = React.useCallback((message: string) => {
    sonnerToast(message)
  }, [])

  // Fungsi untuk dismiss semua toast (opsional)
  const dismissAll = React.useCallback(() => {
    sonnerToast.dismiss()
  }, [])

  return { toast, dismissAll }
}

export { useToast, sonnerToast as toast, Toaster }
