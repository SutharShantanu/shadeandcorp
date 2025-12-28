import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");
    
    // New Filters
    const brand = searchParams.get("brand");
    const sizes = searchParams.get("sizes"); // Expecting comma-separated: "S,M,L"
    const colors = searchParams.get("colors"); // Expecting comma-separated: "Red,Blue"

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    // Filter by Category
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Filter by SubCategory
    if (subCategory) {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, "i") };
    }

    // Search (Title or Description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Filter by Brand
    if (brand) {
        const brandList = brand.split(",").map(b => new RegExp(`^${b.trim()}$`, "i"));
        query.brand = { $in: brandList };
    }

    // Filter by Sizes
    if (sizes) {
        const sizeList = sizes.split(",").map(s => s.trim());
        query.sizes = { $in: sizeList };
    }

    // Filter by Colors
    if (colors) {
        const colorList = colors.split(",").map(c => new RegExp(`^${c.trim()}$`, "i"));
        query["colors.name"] = { $in: colorList };
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // Default: Newest first
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    // Execute Query with Pagination
    const productsQuery = Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(query);

    const products = await productsQuery.exec();

    return NextResponse.json({ 
        success: true, 
        count: products.length, 
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
        data: products 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
