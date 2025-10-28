"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginInput = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    try {
      // Placeholder: call your own login API or use next-auth credentials provider
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      console.log(json)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow dark:bg-zinc-900">
        <h2 className="mb-6 text-2xl font-semibold">Sign in to your account</h2>

        <button
          onClick={() => signIn("google")}
          className="mb-3 w-full rounded bg-red-500 px-4 py-2 text-white"
        >
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="mb-6 w-full rounded bg-black px-4 py-2 text-white"
        >
          Continue with GitHub
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-foreground px-4 py-2 text-background"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/auth/signup" className="font-medium underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}
