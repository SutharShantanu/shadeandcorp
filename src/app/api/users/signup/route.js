import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";
import axios from "axios";
import { getDeviceInfo } from "@/lib/deviceUtils";

export const POST = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    console.log("body", body);
    const {
      firstName,
      lastName = "",
      email,
      phone,
      password,
      terms,
      countryCode,
    } = body;

    if (!firstName || !email || !phone || !countryCode || !password || !terms) {
      return NextResponse.json(
        {
          error: `Please fill all required fields. ${firstName}, ${email}, ${phone}, ${password}, ${terms}`,
        },
        { status: 400 }
      );
    }

    if (!terms) {
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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }
    if (!countryCode) {
      return NextResponse.json({
        error: "Please select a country code along with phone.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract IP address from headers
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "";

    // Get geo info from IP API
    const geoResponse = await axios.get(`http://ipapi.co/${ip}/json/`);
    const geoData = geoResponse.data;

    const deviceInfo = getDeviceInfo(req.headers.get("user-agent"));

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      password: hashedPassword,
      address: [
        {
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
          type: "home",
          isDefault: false,
        },
      ],
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
      sessions: [
        {
          ipAddress: geoData.ip || ip || "",
          city: geoData.city || "",
          region: geoData.region_name || geoData.region || "",
          country: geoData.country_name || "",
          timezone: geoData.timezone || "",
          org: geoData.org || "",
          latitude: geoData.latitude || 0,
          longitude: geoData.longitude || 0,
          deviceInfo: deviceInfo || {},
          loggedInAt: new Date(),
        },
      ],
      paymentMethods: [],
      joinedDate: new Date(),
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered and logged in successfully!" },
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
