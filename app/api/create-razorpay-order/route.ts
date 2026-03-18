import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function razorpayAuth() {
  const key = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", product, coupon, shippingAddress, shippingMethod, giftWrap } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create Razorpay order via REST API (no npm package needed)
    const orderRes = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: razorpayAuth(),
      },
      body: JSON.stringify({
        amount: Math.round(amount), // already in paise from client
        currency,
        receipt: `order_${Date.now()}`,
        notes: {
          productId: product?.id || "",
          productName: product?.name || "",
          size: product?.size || "",
          color: product?.color || "",
          quantity: String(product?.quantity || 1),
          couponCode: coupon?.code || "",
          shippingMethod: shippingMethod || "standard",
          giftWrap: giftWrap?.enabled ? "yes" : "no",
          giftMessage: giftWrap?.message || "",
          userId: session.user.id,
        },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err?.error?.description || "Failed to create Razorpay order");
    }

    const order = await orderRes.json();

    return NextResponse.json({
      success: true,
      order,
      orderDetails: {
        product,
        shippingAddress,
        shippingMethod,
        coupon,
        giftWrap,
      },
    });
  } catch (error: any) {
    console.error("Create Razorpay order error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
