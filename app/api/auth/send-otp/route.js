import { NextResponse } from "next/server";
import twilio from "twilio";
import { otpStoreService } from "@/lib/otpStore";

// --- ENV VARS ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP for 5 minutes using shared store
    otpStoreService.set(phone, otp, 5 * 60 * 1000);

    // Send via Twilio
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioPhone,
      to: phone,
    });

    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
