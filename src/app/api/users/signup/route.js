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
      lastName = "",
      email,
      phoneNumber,
      password,
      termsAccepted,
    } = body;

    if (!firstName || !email || !phoneNumber || !password || !termsAccepted) {
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

    const phoneRegex = /^\+\d{1,3}\s\d{6,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      address: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        countryCode: "91",
      },
      role: "user",
      isVerified: false,
      profile: {
        profilePicture: "",
        socialLinks: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
        bio: "",
      },
      sessions: [],
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
