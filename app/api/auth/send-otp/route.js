import { NextResponse } from "next/server";

// This endpoint is deprecated because phone OTP is now handled via Firebase Phone Auth on the client.
// Keeping it to avoid build errors; it simply returns a message.

export async function POST(req) {
  const { phone } = await req.json();
  if (!phone) {
    return NextResponse.json(
      { success: false, message: "Phone number is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message:
        "This endpoint is deprecated. Phone OTP is handled via Firebase client SDK.",
    },
    { status: 410 }
  );
}
