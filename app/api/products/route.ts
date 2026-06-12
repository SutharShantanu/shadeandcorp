import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/lib/domain/product-logic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const result = await fetchProducts(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
