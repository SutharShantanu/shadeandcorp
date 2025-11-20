import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";

// GET - Fetch user payment methods
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
    const user = await User.findById(session.user.id).select("paymentMethods");

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Mask card numbers for security (only show last 4 digits)
    const maskedPaymentMethods = (user.paymentMethods || []).map((method: any) => ({
      ...method.toObject(),
      cardNumber: `**** **** **** ${method.cardNumber.slice(-4)}`,
    }));

    return NextResponse.json({
      ok: true,
      paymentMethods: maskedPaymentMethods,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// POST - Add new payment method
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
    if (!body.cardNumber || !body.expiryDate || !body.cardHolderName) {
      return NextResponse.json(
        { ok: false, error: "Missing required payment method fields" },
        { status: 400 }
      );
    }

    // Basic card number validation (should be 13-19 digits)
    const cardNumber = body.cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return NextResponse.json(
        { ok: false, error: "Invalid card number" },
        { status: 400 }
      );
    }

    const newPaymentMethod = {
      cardNumber: cardNumber,
      expiryDate: body.expiryDate,
      cardHolderName: body.cardHolderName,
      isDefault: body.isDefault || false,
    };

    // If this is set as default, unset other defaults
    if (newPaymentMethod.isDefault) {
      user.paymentMethods.forEach((method: any) => {
        method.isDefault = false;
      });
    }

    user.paymentMethods.push(newPaymentMethod);
    await user.save();

    // Return masked card number
    const response = {
      ...newPaymentMethod,
      cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
    };

    return NextResponse.json({
      ok: true,
      paymentMethod: response,
      message: "Payment method added successfully",
    });
  } catch (error) {
    console.error("Add payment method error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// PATCH - Update payment method
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

    const { paymentMethodId, ...updateData } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { ok: false, error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const methodIndex = user.paymentMethods.findIndex(
      (method: any) => method._id?.toString() === paymentMethodId
    );

    if (methodIndex === -1) {
      return NextResponse.json(
        { ok: false, error: "Payment method not found" },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      user.paymentMethods.forEach((method: any, index: number) => {
        if (index !== methodIndex) {
          method.isDefault = false;
        }
      });
    }

    // Update payment method fields
    if (updateData.cardNumber) {
      const cardNumber = updateData.cardNumber.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(cardNumber)) {
        return NextResponse.json(
          { ok: false, error: "Invalid card number" },
          { status: 400 }
        );
      }
      updateData.cardNumber = cardNumber;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        (user.paymentMethods[methodIndex] as any)[key] = updateData[key];
      }
    });

    await user.save();

    // Return masked card number
    const updatedMethod = user.paymentMethods[methodIndex].toObject();
    updatedMethod.cardNumber = `**** **** **** ${updatedMethod.cardNumber.slice(-4)}`;

    return NextResponse.json({
      ok: true,
      paymentMethod: updatedMethod,
      message: "Payment method updated successfully",
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment method
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
    const paymentMethodId = searchParams.get("paymentMethodId");

    if (!paymentMethodId) {
      return NextResponse.json(
        { ok: false, error: "Payment method ID is required" },
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

    user.paymentMethods = user.paymentMethods.filter(
      (method: any) => method._id?.toString() !== paymentMethodId
    );

    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment method error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

