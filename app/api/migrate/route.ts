import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/infrastructure/mongoDB";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import Asset from "@/models/Asset";
import { fetchUnsplashImages } from "@/lib/infrastructure/unsplash";
import { uploadImageToBlob } from "@/lib/infrastructure/blob-upload";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = parseInt(searchParams.get("skip") || "0", 10);

        await connectDB();

        // Find products that have an 'images' field (old schema indicator)
        const productsToMigrate = await Product.find({ images: { $exists: true, $not: { $size: 0 } } })
            .skip(skip)
            .limit(limit);

        if (productsToMigrate.length === 0) {
            return NextResponse.json({ success: true, message: "No products found for migration" });
        }

        const results = [];

        for (const prod of productsToMigrate) {
            const product = prod as any;
            console.log(`Migrating product: ${product.title} (${product._id})`);

            try {
                // 1. Extract Colors and Sizes
                const colors = Array.isArray(product.colors) ? product.colors : ["Default"];
                const sizes = Array.isArray(product.sizes) ? product.sizes : ["Free Size"];

                // 2. Map Price
                const basePrice = product.price || 0;
                const originalPrice = product.originalPrice || 0;

                // 3. Process each color variant
                // To avoid exploding Unsplash limits, we only fetch for colors
                // and reuse those images for different sizes of the same color
                for (const colorValue of colors) {
                    // colorValue could be string or object {name, hex}
                    const colorName = typeof colorValue === "string" ? colorValue : colorValue.name;
                    const colorHex = typeof colorValue === "string" ? "#cccccc" : colorValue.hex;

                    // Fetch Unsplash images for THIS color
                    const query = `${colorName} ${product.title} isolated product`;
                    const unsplashImages = await fetchUnsplashImages({ query, perPage: 3 });

                    for (const size of sizes) {
                        // Create Variant
                        const variantId = new mongoose.Types.ObjectId();
                        const variant = await Variant.create({
                            _id: variantId,
                            productId: product._id,
                            color: { name: colorName, hex: colorHex },
                            size,
                            sku: `${product.sku}-${colorName.substring(0, 3).toUpperCase()}-${size}`,
                            price: basePrice,
                            originalPrice: originalPrice > basePrice ? originalPrice : undefined,
                            stockQuantity: 20,
                            isDefault: colorValue === colors[0] && size === sizes[0],
                        });

                        // Create Assets for this variant
                        for (let i = 0; i < unsplashImages.length; i++) {
                            const img = unsplashImages[i];
                            const path = `products/${product._id}/variants/${variant._id}/${i + 1}.webp`;

                            const blobUrl = await uploadImageToBlob({
                                imageUrl: img.urls.regular,
                                path
                            });

                            await Asset.create({
                                productId: product._id,
                                variantId: variant._id,
                                type: "image",
                                role: i === 0 ? "thumbnail" : "gallery",
                                url: blobUrl,
                                alt: img.alt || `${product.title} ${colorName}`,
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

                // 4. Update Product Record to Normalized Schema
                await Product.updateOne(
                    { _id: product._id },
                    {
                        $set: { basePrice },
                        $unset: {
                            price: "",
                            images: "",
                            colors: "",
                            sizes: "",
                            inStock: "",
                            stockQuantity: ""
                        }
                    }
                );

                results.push({ id: product._id, title: product.title, status: "success" });
            } catch (err: any) {
                console.error(`Failed to migrate product ${product._id}:`, err);
                results.push({ id: product._id, title: product.title, status: "failed", error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results
        });

    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
