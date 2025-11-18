import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        gender: user.gender,
        birthday: user.birthday,
        bio: (user as any).bio || "",
        urls: (user as any).urls || [],
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    await connectDB();
    
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "profilePicture",
      "gender",
      "birthday",
      "bio",
      "urls",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        (user as any)[field] = body[field];
      }
    }

    await user.save();

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      ok: true,
      user: userWithoutPassword,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

