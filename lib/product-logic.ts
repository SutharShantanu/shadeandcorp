import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import Asset from "@/models/Asset";

export async function fetchProducts(searchParams: any) {
    try {
        await connectDB();

        const category = searchParams.category;
        const subCategory = searchParams.subCategory;
        const search = searchParams.search;
        const minPrice = searchParams.minPrice;
        const maxPrice = searchParams.maxPrice;
        const sort = searchParams.sort;
        const featured = searchParams.featured;
        const brand = searchParams.brand;
        const sizes = searchParams.sizes;
        const colors = searchParams.colors;

        const page = parseInt(searchParams.page || "1", 10);
        const limit = parseInt(searchParams.limit || "9", 10);
        const skip = (page - 1) * limit;

        const query: Record<string, any> = {};

        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        if (subCategory) {
            query.subCategory = { $regex: new RegExp(`^${subCategory}$`, "i") };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        if (brand) {
            const brandList = brand.split(",").map((b: string) => new RegExp(`^${b.trim()}$`, "i"));
            query.brand = { $in: brandList };
        }

        if (sizes) {
            const sizeList = sizes.split(",").map((s: string) => s.trim());
            query.sizes = { $in: sizeList };
        }

        if (colors) {
            const colorList = colors.split(",").map((c: string) => c.trim());
            // We'll handle color filtering in the aggregation
        }

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };
        else if (sort === "rating") sortOption = { rating: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const pipeline: any[] = [
            { $match: query },
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limit },
            // Lookup Variants
            {
                $lookup: {
                    from: "variants",
                    localField: "_id",
                    foreignField: "productId",
                    as: "variants"
                }
            },
            // Lookup Assets
            {
                $lookup: {
                    from: "assets",
                    localField: "_id",
                    foreignField: "productId",
                    as: "assets"
                }
            },
            // Format output fields to match type definitions
            {
                $addFields: {
                    id: { $toString: "$_id" },
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    "variants._id": 0,
                    "variants.__v": 0,
                    "assets._id": 0,
                    "assets.__v": 0,
                }
            }
        ];

        // If colors are provided, filter by variants that have those colors
        if (colors) {
            const colorList = colors.split(",").map((c: string) => c.trim().toLowerCase());
            pipeline.splice(1, 0, {
                $lookup: {
                    from: "variants",
                    localField: "_id",
                    foreignField: "productId",
                    as: "temp_variants"
                }
            });
            pipeline.splice(2, 0, {
                $match: {
                    "temp_variants.color.name": { $in: colorList.map((c: string) => new RegExp(`^${c}$`, "i")) }
                }
            });
            pipeline.splice(3, 0, { $project: { temp_variants: 0 } });
        }

        const products = await Product.aggregate(pipeline);
        const totalCount = await Product.countDocuments(query);

        return {
            success: true,
            count: products.length,
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
            data: JSON.parse(JSON.stringify(products)),
        };
    } catch (error) {
        console.error("Error in fetchProducts logic:", error);
        return {
            success: false,
            count: 0,
            total: 0,
            page: 1,
            totalPages: 0,
            data: [],
            error: "Failed to load products",
        };
    }
}
