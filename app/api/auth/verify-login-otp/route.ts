import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";
import { getDeviceInfo } from "@/lib/deviceUtils";
import { otpStoreService } from "@/lib/otpStore";

interface GeoData {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  timezone?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
}

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone & OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP using shared store
    const isValid = otpStoreService.verify(phone, otp);

    if (!isValid) {
      const saved = otpStoreService.get(phone);
      if (!saved) {
        return NextResponse.json(
          { success: false, message: "No OTP found, please request again" },
          { status: 404 }
        );
      }
      if (saved.expiresAt < Date.now()) {
        otpStoreService.delete(phone);
        return NextResponse.json(
          { success: false, message: "OTP expired, please resend" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is correct - verify user exists and sign them in
    await connectDB();
    const user = await User.findOne({ phone: phone.trim() });

    if (!user) {
      otpStoreService.delete(phone);
      return NextResponse.json(
        { success: false, message: "No account found with this phone number" },
        { status: 404 }
      );
    }

    if (user.accountStatus === "suspended") {
      return NextResponse.json(
        { success: false, message: "Account suspended" },
        { status: 403 }
      );
    }

    if (user.accountStatus === "deleted") {
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }

    // Track login session
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp;

    let geoData: GeoData = {};
    try {
      if (ip) {
        const geoResponse = await fetch(`http://ipapi.co/${ip}/json/`);
        geoData = await geoResponse.json();
      }
    } catch (err) {
      console.warn("Geo API error:", err instanceof Error ? err.message : "Unknown error");
    }

    const userAgent = req.headers.get("user-agent") || "";
    const deviceInfo = getDeviceInfo(userAgent);

    user.sessions.push({
      ipAddress: geoData.ip || ip || "Unknown",
      city: geoData.city,
      region: geoData.region,
      country: geoData.country_name,
      timezone: geoData.timezone,
      org: geoData.org,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      deviceInfo: JSON.stringify(deviceInfo) || userAgent,
      loggedInAt: new Date(),
    });

    user.isPhoneVerified = true; // Mark phone as verified
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP after successful verification
    otpStoreService.delete(phone);
    
    // Store verification token for credentials provider (expires in 5 minutes)
    otpStoreService.setVerificationToken(phone, 5 * 60 * 1000);

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        user: {
          id: String(user._id),
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.profilePicture,
          
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Verification error" },
      { status: 500 }
    );
  }
}

