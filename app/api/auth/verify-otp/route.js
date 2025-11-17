import { NextResponse } from "next/server";

// Use the same store (in real world move to Redis)
const otpStore = new Map();

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone & OTP are required" },
        { status: 400 }
      );
    }

    const saved = otpStore.get(phone);

    if (!saved) {
      return NextResponse.json(
        { success: false, message: "No OTP found, please request again" },
        { status: 404 }
      );
    }

    if (saved.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return NextResponse.json(
        { success: false, message: "OTP expired, please resend" },
        { status: 400 }
      );
    }

    if (saved.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is correct
    otpStore.delete(phone);

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
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
