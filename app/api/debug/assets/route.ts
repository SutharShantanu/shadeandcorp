import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Asset from "@/models/Asset";
import Product from "@/models/Product";

export async function GET() {
    try {
        await connectDB();

        const assetCount = await Asset.countDocuments();
        const productCount = await Product.countDocuments();

        // Get sample assets
        const sampleAssets = await Asset.find().limit(5).populate('productId');

        // Get products with their asset counts
        const productsWithAssets = await Product.aggregate([
            {
                $lookup: {
                    from: 'assets',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'assets'
                }
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    assetCount: { $size: '$assets' }
                }
            },
            { $limit: 10 }
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                totalAssets: assetCount,
                totalProducts: productCount,
            },
            sampleAssets: sampleAssets.map(a => ({
                id: a._id,
                productId: a.productId,
                variantId: a.variantId,
                url: a.url,
                role: a.role,
            })),
            productsWithAssets,
        });
    } catch (error) {
        console.error("Error checking assets:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
