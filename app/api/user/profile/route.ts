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
        countryCode: user.countryCode,
        profilePicture: user.profilePicture,
        gender: user.gender,
        birthday: user.birthday,
        addresses: user.addresses || [],
        paymentMethods: user.paymentMethods || [],
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        role: user.role,
        accountStatus: user.accountStatus,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

    // Update allowed fields (users can't update email, role, accountStatus, etc.)
    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "countryCode",
      "profilePicture",
      "gender",
      "birthday",
      "bio",
      "urls",
    ];

    for (const field of allowedFields) {
      if (field in body && body[field] !== undefined) {
        // Handle date fields
        if (field === "birthday" && body[field]) {
          (user as User)[field] = new Date(body[field]);
        } else {
          (user as User)[field] = body[field];
        }
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

