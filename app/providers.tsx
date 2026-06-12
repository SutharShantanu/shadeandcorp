"use client"

import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  )
}
