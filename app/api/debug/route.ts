import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).limit(5).select("-password");
    return NextResponse.json({ ok: true, count: users.length, users });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
