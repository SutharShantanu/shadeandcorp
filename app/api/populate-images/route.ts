import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import connectDB from "@/lib/infrastructure/mongoDB";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import Asset from "@/models/Asset";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    user: {
        name: string;
        links: {
            html: string;
        };
    };
    alt_description: string | null;
}

async function fetchUnsplashImage(query: string): Promise<UnsplashImage | null> {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=portrait`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (!response.ok) {
            console.error(`Unsplash API error: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching from Unsplash:", error);
        return null;
    }
}

async function uploadToBlob(imageUrl: string, filename: string): Promise<string | null> {
    try {
        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            console.error(`Failed to fetch image: ${imageResponse.status}`);
            return null;
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const blob = await put(filename, imageBuffer, {
            access: "public",
            contentType: "image/jpeg",
        });

        return blob.url;
    } catch (error) {
        console.error("Error uploading to Blob:", error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { category, limit = 10 } = await request.json();

        if (!UNSPLASH_ACCESS_KEY) {
            return NextResponse.json(
                { error: "Unsplash API key not configured" },
                { status: 500 }
            );
        }

        await connectDB();

        // Build query
        const query: any = {};
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        // Fetch products
        const products = await Product.find(query).limit(limit);

        const results = {
            processed: 0,
            success: 0,
            failed: 0,
            details: [] as any[],
        };

        for (const product of products) {
            results.processed++;

            try {
                // Fetch variants for this product
                const variants = await Variant.find({ productId: product._id });

                // Check if assets already exist
                const existingAssets = await Asset.find({ productId: product._id });
                if (existingAssets.length > 0) {
                    results.details.push({
                        productId: product._id,
                        title: product.title,
                        status: "skipped",
                        reason: "Assets already exist",
                    });
                    continue;
                }

                const createdAssets = [];

                // 1. Create common product images (2 images)
                for (let i = 0; i < 2; i++) {
                    const searchQuery = `${product.category} ${product.subCategory} ${product.title}`;
                    const unsplashImage = await fetchUnsplashImage(searchQuery);

                    if (unsplashImage) {
                        const filename = `products/${product.slug}-common-${i}.jpg`;
                        const blobUrl = await uploadToBlob(unsplashImage.urls.regular, filename);

                        if (blobUrl) {
                            const asset = await Asset.create({
                                productId: product._id,
                                variantId: null,
                                type: "image",
                                role: i === 0 ? "thumbnail" : "gallery",
                                url: blobUrl,
                                alt: unsplashImage.alt_description || `${product.title} - Image ${i + 1}`,
                                order: i,
                                metadata: {
                                    source: "unsplash",
                                    photographerName: unsplashImage.user.name,
                                    photographerUrl: unsplashImage.user.links.html,
                                },
                            });
                            createdAssets.push(asset);
                        }
                    }

                    // Rate limiting - wait 1 second between requests
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                // 2. Create variant-specific images (1 per color variant)
                const uniqueColors = Array.from(
                    new Set(variants.map((v) => JSON.stringify(v.color)))
                ).map((s) => JSON.parse(s));

                for (const color of uniqueColors) {
                    const variant = variants.find((v) => v.color.name === color.name);
                    if (!variant) continue;

                    const searchQuery = `${product.category} ${product.subCategory} ${color.name}`;
                    const unsplashImage = await fetchUnsplashImage(searchQuery);

                    if (unsplashImage) {
                        const filename = `products/${product.slug}-${color.name.toLowerCase()}.jpg`;
                        const blobUrl = await uploadToBlob(unsplashImage.urls.regular, filename);

                        if (blobUrl) {
                            const asset = await Asset.create({
                                productId: product._id,
                                variantId: variant._id,
                                type: "image",
                                role: "gallery",
                                url: blobUrl,
                                alt: `${product.title} - ${color.name}`,
                                order: 10 + uniqueColors.indexOf(color),
                                metadata: {
                                    source: "unsplash",
                                    photographerName: unsplashImage.user.name,
                                    photographerUrl: unsplashImage.user.links.html,
                                },
                            });
                            createdAssets.push(asset);
                        }
                    }

                    // Rate limiting
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                results.success++;
                results.details.push({
                    productId: product._id,
                    title: product.title,
                    status: "success",
                    assetsCreated: createdAssets.length,
                });
            } catch (error) {
                results.failed++;
                results.details.push({
                    productId: product._id,
                    title: product.title,
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${results.processed} products`,
            results,
        });
    } catch (error) {
        console.error("Error in populate-images:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
