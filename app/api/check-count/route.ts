import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET() {
    await connectDB();
    const count = await Product.countDocuments({});
    const hasOldField = await Product.countDocuments({ images: { $exists: true } });

    return NextResponse.json({
        totalProducts: count,
        productsWithImagesField: hasOldField
    });
}
