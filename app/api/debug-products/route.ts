import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET() {
    await connectDB();

    const products = await Product.find({}).limit(10).select('title category subCategory');
    const categories = await Product.distinct('category');
    const subCategories = await Product.distinct('subCategory');

    return NextResponse.json({
        sampleProducts: products,
        allCategories: categories,
        allSubCategories: subCategories
    });
}
