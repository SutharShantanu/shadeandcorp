import { NextResponse } from "next/server";
import { otpStoreService } from "@/lib/otpStore";

export async function POST(req) {
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

    // OTP is correct - delete it
    otpStoreService.delete(phone);

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
