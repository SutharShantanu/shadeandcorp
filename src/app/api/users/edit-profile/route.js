import { NextResponse } from "next/server";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";

export const PUT = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No update data provided." },
        { status: 400 }
      );
    }

    // Optional: validate fields or sanitize here if needed

    // Update user document with partial fields
    // $set updates only fields in body without overwriting entire doc
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true, context: "query" }
    ).select("-password"); // exclude password from response

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
};
