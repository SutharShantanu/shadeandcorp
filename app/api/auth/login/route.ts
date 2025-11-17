import { NextResponse } from "next/server"

// This route is kept for backward compatibility
// The actual login is handled by NextAuth's credentials provider
// Client-side should use signIn from "next-auth/react"
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Note: Authentication is handled by NextAuth's credentials provider
    // This route is kept for compatibility but login should be done via NextAuth
    return NextResponse.json(
      { 
        message: "Please use NextAuth signIn function from client side",
        redirect: "/api/auth/signin"
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
