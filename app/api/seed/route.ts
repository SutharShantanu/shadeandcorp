import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    const products = [
      {
        title: "Classic White T-Shirt",
        description: "A timeless classic. This white t-shirt is made from 100% organic cotton for ultimate comfort and durability. Perfect for any casual occasion.",
        brand: "Shade & Co",
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        category: "Men",
        subCategory: "T-Shirts",
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "White", value: "#ffffff" }],
        inStock: true,
        stockQuantity: 50,
        isNew: true,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 120,
        tags: ["casual", "cotton", "basics"],
        sku: "M-TS-001",
        slug: "classic-white-t-shirt",
      },
      {
        title: "Slim Fit Navy Jeans",
        description: "Modern slim fit jeans in a deep navy wash. Features a comfortable stretch denim and classic five-pocket styling.",
        brand: "Denim Co",
        price: 59.99,
        originalPrice: 79.99,
        discount: 25,
        images: ["https://images.unsplash.com/photo-1542272617-08f083157f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        category: "Men",
        subCategory: "Jeans",
        sizes: ["30", "32", "34", "36"],
        colors: [{ name: "Navy", value: "#000080" }],
        inStock: true,
        stockQuantity: 30,
        rating: 4.8,
        reviewCount: 85,
        tags: ["denim", "pants", "casual"],
        sku: "M-JN-001",
        slug: "slim-fit-navy-jeans",
      },
      {
        title: "Floral Summer Dress",
        description: "Lightweight and breezy floral dress perfect for summer days. Features a flattering A-line silhouette and adjustable straps.",
        brand: "Bloom",
        price: 45.00,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        category: "Women",
        subCategory: "Dresses",
        sizes: ["XS", "S", "M", "L"],
        colors: [{ name: "Pink Floral", value: "#ffc0cb" }],
        inStock: true,
        stockQuantity: 20,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 200,
        tags: ["summer", "floral", "dress"],
        sku: "W-DR-001",
        slug: "floral-summer-dress",
      },
       {
        title: "Designer Sunglasses",
        description: "Premium aviator sunny with UV400 protection.",
        brand: "RayBan",
        price: 150.00,
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        category: "Accessories",
        subCategory: "Sunglasses",
        sizes: ["One Size"],
        colors: [{ name: "Gold", value: "#FFD700" }],
        inStock: true,
        stockQuantity: 10,
        sku: "A-SG-001",
        slug: "designer-sunglasses",
      }
    ];

    await Product.insertMany(products);

    return NextResponse.json({ success: true, message: "Products seeded successfully", count: products.length });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: "Seeding failed" }, { status: 500 });
  }
}
