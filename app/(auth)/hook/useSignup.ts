"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/types/auth"
import type { z } from "zod"
type RegisterInput = z.infer<typeof registerSchema>
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useSignup() {
  const router = useRouter()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        form.setError("root", {
          type: "manual",
          message: json?.error || "Registration failed",
        })
        return false
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        form.setError("root", {
          type: "manual",
          message: "Registration succeeded but sign-in failed",
        })
        return false
      }

      router.push("/")
      router.refresh()
      return true
    } catch (error) {
      console.error("Signup error:", error)
      form.setError("root", { type: "manual", message: "Server error" })
      return false
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, onSubmit }
}

export default useSignup
