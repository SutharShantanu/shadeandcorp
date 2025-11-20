import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";
import { AddressTypeEnum } from "@/models/User";

// GET - Fetch user addresses
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
    const user = await User.findById(session.user.id).select("addresses");

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// POST - Add new address
export async function POST(req: Request) {
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

    // Validate required fields
    if (!body.address1 || !body.city || !body.state || !body.zipCode || !body.country) {
      return NextResponse.json(
        { ok: false, error: "Missing required address fields" },
        { status: 400 }
      );
    }

    const newAddress = {
      address1: body.address1,
      address2: body.address2 || "",
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      addressType: body.addressType || AddressTypeEnum.HOME,
      isDefault: body.isDefault || false,
    };

    // If this is set as default, unset other defaults
    if (newAddress.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({
      ok: true,
      address: newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH - Update address
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

    const { addressId, ...updateData } = body;

    if (!addressId) {
      return NextResponse.json(
        { ok: false, error: "Address ID is required" },
        { status: 400 }
      );
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { ok: false, error: "Address not found" },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      user.addresses.forEach((addr: any, index: number) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update address fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        (user.addresses[addressIndex] as any)[key] = updateData[key];
      }
    });

    await user.save();

    return NextResponse.json({
      ok: true,
      address: user.addresses[addressIndex],
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { ok: false, error: "Address ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    user.addresses = user.addresses.filter(
      (addr: any) => addr._id?.toString() !== addressId
    );

    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

