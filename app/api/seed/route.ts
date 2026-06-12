import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/infrastructure/mongoDB";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import Asset from "@/models/Asset";
import { fetchUnsplashImages } from "@/lib/infrastructure/unsplash";
import { uploadImageToBlob } from "@/lib/infrastructure/blob-upload";

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Variant.deleteMany({});
    await Asset.deleteMany({});

    const productsData = [
      {
        title: "Premium Cotton Hoodie",
        description: "Experience ultimate warmth and comfort with our premium hoodie. Made from heavy-weight brush-back fleece.",
        brand: "Shade & Co",
        basePrice: 59.99,
        category: "Men",
        subCategory: "Hoodies",
        isNew: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 156,
        tags: ["casual", "winter", "essentials"],
        sku: "M-HD-001",
        slug: "premium-cotton-hoodie",
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Grey", hex: "#808080" }
        ]
      },
      {
        title: "Classic Canvas Sneakers",
        description: "Lightweight and durable canvas sneakers for everyday wear.",
        brand: "WalkEase",
        basePrice: 45.00,
        category: "Men",
        subCategory: "Shoes",
        isNew: true,
        rating: 4.5,
        reviewCount: 42,
        tags: ["canvas", "shoes", "casual"],
        sku: "M-SH-002",
        slug: "classic-canvas-sneakers",
        colors: [
          { name: "White", hex: "#ffffff" },
          { name: "Navy Blue", hex: "#000080" }
        ]
      }
    ];

    for (const data of productsData) {
      const { colors, ...productBase } = data as any;
      const product = await Product.create(productBase) as any;

      for (const color of colors) {
        // Create 2 variants per color (M, L)
        const sizes = ["M", "L"];
        for (const size of sizes) {
          const variantId = new mongoose.Types.ObjectId();
          const variant = await Variant.create({
            _id: variantId,
            productId: product._id,
            color: color,
            size: size,
            sku: `${productBase.sku}-${color.name.substring(0, 3).toUpperCase()}-${size}`,
            price: productBase.basePrice,
            stockQuantity: 20,
            isDefault: color.name === colors[0].name && size === "M",
          }) as any;

          // Fetch images for this color
          const query = `${color.name} ${productBase.title} isolated product`;
          const unsplashImages = await fetchUnsplashImages({ query, perPage: 3 });

          for (let i = 0; i < unsplashImages.length; i++) {
            const img = unsplashImages[i];
            const blobUrl = await uploadImageToBlob({
              imageUrl: img.urls.regular,
              path: `products/${product._id}/variants/${variant._id}/${i + 1}.webp`
            });

            await Asset.create({
              productId: product._id,
              variantId: variant._id,
              type: "image",
              role: i === 0 ? "thumbnail" : "gallery",
              url: blobUrl,
              alt: img.alt,
              order: i,
              metadata: {
                source: "unsplash",
                photographerName: img.user.name,
                photographerUrl: img.user.profileUrl
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Database re-seeded with normalized structure" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: "Seeding failed" }, { status: 500 });
  }
}
