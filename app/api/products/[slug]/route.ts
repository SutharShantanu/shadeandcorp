import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Use aggregation so we get variants + assets in one query (same pattern as fetchProducts)
    const pipeline: any[] = [
      { $match: { slug } },
      { $limit: 1 },
      // Lookup Variants
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
      // Lookup Assets (both product-level and variant-level)
      {
        $lookup: {
          from: "assets",
          let: { productId: "$_id", variantIds: "$variants._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$productId", "$$productId"] },
                    { $in: ["$variantId", "$$variantIds"] },
                  ],
                },
              },
            },
            { $sort: { order: 1 } },
          ],
          as: "assets",
        },
      },
      // Normalise id fields to strings (matches frontend Product type)
      {
        $addFields: {
          id: { $toString: "$_id" },
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  { id: { $toString: "$$variant._id" } },
                ],
              },
            },
          },
          assets: {
            $map: {
              input: "$assets",
              as: "asset",
              in: {
                $mergeObjects: [
                  "$$asset",
                  {
                    productId: { $toString: "$$asset.productId" },
                    variantId: { $toString: "$$asset.variantId" },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "variants._id": 0,
          "variants.__v": 0,
          "assets._id": 0,
          "assets.__v": 0,
        },
      },
    ];

    const results = await Product.aggregate(pipeline);

    if (!results.length) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(results[0])) });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
