"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="-ml-2 rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            <Menu />
          </button>
          <Link href="/" className="text-2xl font-bold">
            Shade & Co
          </Link>
        </div>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <NavigationMenu />
          <div className="flex w-1/3 items-center">
            <Input placeholder="Search products, brands..." />
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost">Cart</Button>
          </Link>
          <Link href="/auth/login">
            <Avatar>
              <div className="h-8 w-8 rounded-full bg-zinc-300" />
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
