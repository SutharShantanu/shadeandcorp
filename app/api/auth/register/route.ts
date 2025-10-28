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
