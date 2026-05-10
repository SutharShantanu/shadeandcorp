import { NextResponse } from "next/server"
import { registerSchema } from "@/types/auth"
import { getUserByEmail, getUserByPhone, createUser } from "@/lib/db"
import connectDB from "@/lib/mongoDB"
import { RoleEnum } from "@/models/User"
import { parsePhoneNumber } from "libphonenumber-js";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("body", body)
    const parsed = registerSchema.safeParse(body)
    console.log("parsed", parsed)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password } = parsed.data;

    // Connect to database
    await connectDB()

    // Check if user already exists by email
    if (email && email.trim() !== "") {
      const existingByEmail = await getUserByEmail(email)
      if (existingByEmail) {
        return NextResponse.json(
          { ok: false, error: "User with this email already exists" },
          { status: 409 }
        )
      }
    }

    // Parse phone number from E.164 format and extract country code
    let phoneNumber: string | undefined = undefined
    let countryCode: string = "91" // Default to India

    if (phone && phone.trim() !== "") {
      // Check if user already exists by phone (using the full E.164 format for lookup)
      const existingByPhone = await getUserByPhone(phone.trim())
      if (existingByPhone) {
        return NextResponse.json(
          { ok: false, error: "User with this phone number already exists" },
          { status: 409 }
        )
      }

      try {
        const parsedPhone = parsePhoneNumber(phone.trim())
        if (parsedPhone) {
          phoneNumber = parsedPhone.number || phone.trim() // Store full E.164 format for easier lookup
          countryCode = parsedPhone.countryCallingCode
        } else {
          // If parsing fails, store the phone as-is
          phoneNumber = phone.trim()
        }
      } catch (error) {
        // If parsing fails, store the phone as-is
        phoneNumber = phone.trim()
      }
    }

    // Create user with customer role by default
    // If no email provided, generate a placeholder email for phone-only users
    const userEmail = email && email.trim() !== ""
      ? email.toLowerCase().trim()
      : `phone_${phoneNumber || phone?.trim() || ""}_${Date.now()}@placeholder.local`

    const userData = {
      firstName,
      lastName,
      email: userEmail,
      phone: phoneNumber,
      countryCode,
      password, // Password will be hashed by the User model's pre-save hook
      role: RoleEnum.CUSTOMER, // Default role is customer
      accountStatus: "active",
      isEmailVerified: email && email.trim() !== "" ? false : false,
      isPhoneVerified: false,
      connectedProviders: { credentials: true }
    }

    const user = await createUser(userData)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        ok: true,
        user: userWithoutPassword,
        message: "User created successfully"
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error
    })

    return NextResponse.json(
      { 
        ok: false, 
        error: "Server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
