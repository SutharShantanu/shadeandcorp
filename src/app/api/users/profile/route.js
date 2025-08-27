import { NextResponse } from "next/server";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
};

