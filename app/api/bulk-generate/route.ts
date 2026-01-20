import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import Asset from "@/models/Asset";
import { fetchUnsplashImages } from "@/lib/unsplash";
import { uploadImageToBlob } from "@/lib/blob-upload";
import { generateDummyProducts, SIZES } from "@/lib/product-generator";

export async function GET(request: Request) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendProgress = (msg: string) => {
                controller.enqueue(encoder.encode(msg + "\n"));
            };

            try {
                const { searchParams } = new URL(request.url);
                const count = parseInt(searchParams.get("count") || "10", 10);
                const clear = searchParams.get("clear") === "true";
                const skip = parseInt(searchParams.get("skip") || "0", 10);

                sendProgress("--- Connecting to Database ---");
                await connectDB();

                if (clear) {
                    sendProgress("--- Clearing existing data ---");
                    await Product.deleteMany({});
                    await Variant.deleteMany({});
                    await Asset.deleteMany({});
                }

                const dummyData = generateDummyProducts(count + skip).slice(skip);
                sendProgress(`--- Starting generation: ${dummyData.length} products ---`);

                for (let idx = 0; idx < dummyData.length; idx++) {
                    const data = dummyData[idx];
                    const { availableColors, sizeGroup, ...productData } = data as any;

                    sendProgress(`[${idx + 1}/${dummyData.length}] Creating: ${productData.title} (${productData.category})`);

                    try {
                        const product = await Product.create(productData);
                        const sizes = SIZES[sizeGroup as keyof typeof SIZES];

                        for (const color of availableColors) {
                            const query = `${color.name} ${productData.title} isolated product retail`;
                            let images = await fetchUnsplashImages({ query, perPage: 2 });

                            if (images.length === 0) {
                                images = [{
                                    urls: { regular: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
                                    user: { name: "Unsplash", profileUrl: "https://unsplash.com" },
                                    alt: "Product Placeholder"
                                }];
                            }

                            for (const size of sizes) {
                                const variantId = new mongoose.Types.ObjectId();
                                const variant = await Variant.create({
                                    _id: variantId,
                                    productId: product._id,
                                    color: color,
                                    size: size,
                                    sku: `${productData.sku}-${color.name.substring(0, 3).toUpperCase()}-${size}`,
                                    price: productData.basePrice,
                                    stockQuantity: 50,
                                    isDefault: color === availableColors[0] && size === sizes[0],
                                });

                                for (let i = 0; i < images.length; i++) {
                                    const img = images[i];
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
                        sendProgress(`  ✅ Success: ${productData.title}`);
                    } catch (err: any) {
                        sendProgress(`  ❌ Error: ${productData.title} - ${err.message}`);
                    }
                }

                sendProgress("--- Generation Complete ---");
                controller.close();
            } catch (error: any) {
                sendProgress(`!!! Fatal error: ${error.message}`);
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
