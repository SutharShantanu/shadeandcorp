import connectDB from "@/lib/mongoDB";
import Product from "@/models/Product";

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
        const limit = parseInt(searchParams.limit || "12", 10);
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
            const colorList = colors.split(",").map((c: string) => new RegExp(`^${c.trim()}$`, "i"));
            query["colors.name"] = { $in: colorList };
        }

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };
        else if (sort === "rating") sortOption = { rating: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const totalCount = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            success: true,
            count: products.length,
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
            data: JSON.parse(JSON.stringify(products)), // Ensure plain objects for Server Components
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
