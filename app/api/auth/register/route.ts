import { NextResponse } from "next/server"
import { registerSchema } from "@/types/auth"
import { getUserByEmail, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ ok: false, error: "User already exists" }, { status: 409 })
    }

    const passwordHash = hashPassword(password)

    const user = await createUser({ name, email, passwordHash })

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { registerSchema } from "@/types/auth"
import { getUserByEmail, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ ok: false, error: "User already exists" }, { status: 409 })
    }

    const passwordHash = hashPassword(password)

    const user = await createUser({ name, email, passwordHash })

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // This is a placeholder. In a real app you'd create a user record and hash passwords.
    console.log("register body", body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}
