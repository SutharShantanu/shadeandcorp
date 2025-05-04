import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      termsAccepted,
    } = body;

    // 1. Validate required fields
    if (!firstName || !email || !phoneNumber || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the terms and conditions." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+\d{1,3}\s\d{6,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format." },
        { status: 400 }
      );
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
