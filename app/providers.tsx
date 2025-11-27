"use client"

import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </SessionProvider>
    </Provider>
  )
}
