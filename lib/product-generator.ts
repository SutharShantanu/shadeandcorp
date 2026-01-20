const CATEGORIES = {
    Men: ["Hoodies", "T-Shirts", "Jeans", "Shoes", "Watches"],
    Women: ["Dresses", "Tops", "Skirts", "Handbags", "Jewelry"],
    Kids: ["T-Shirts", "Shorts", "Sweaters", "Sneakers", "Toys"],
    Accessories: ["Belts", "Sunglasses", "Wallets", "Caps"],
};

const BRANDS = [
    "Nike", "Adidas", "Zara", "Versace", "Gucci", "Prada", "Puma",
    "Levi's", "H&M", "Armani", "Calvin Klein", "Rolex"
];

const COLORS = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#ffffff" },
    { name: "Navy", hex: "#000080" },
    { name: "Grey", hex: "#808080" },
    { name: "Red", hex: "#ff0000" },
    { name: "Beige", hex: "#f5f5dc" }
];

const SIZES = {
    Clothing: ["S", "M", "L", "XL"],
    Shoes: ["7", "8", "9", "10", "11"],
    Accessories: ["One Size"]
};

export function generateDummyProducts(count: number) {
    const products = [];
    const genders = Object.keys(CATEGORIES);

    for (let i = 0; i < count; i++) {
        const gender = genders[i % genders.length];
        const subCats = CATEGORIES[gender as keyof typeof CATEGORIES];
        const subCategory = subCats[Math.floor(Math.random() * subCats.length)];
        const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
        const basePrice = Math.floor(Math.random() * 150) + 20;

        products.push({
            title: `${brand} Premium ${subCategory} ${i + 1}`,
            description: `High-quality ${subCategory.toLowerCase()} from ${brand}. Perfect for everyday comfort and style.`,
            brand,
            basePrice,
            category: gender,
            subCategory,
            isNew: Math.random() > 0.7,
            isFeatured: Math.random() > 0.8,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500),
            tags: [subCategory.toLowerCase(), gender.toLowerCase(), "premium"],
            sku: `${gender[0]}-${subCategory.substring(0, 2).toUpperCase()}-${1000 + i}`,
            slug: `${brand.toLowerCase()}-${subCategory.toLowerCase()}-${i + 1}`,
            // Selection of colors for this product
            availableColors: COLORS.slice(0, Math.floor(Math.random() * 3) + 2),
            // Group (Clothing, Shoes, etc) to determine sizes
            sizeGroup: subCategory === "Shoes" ? "Shoes" : (gender === "Accessories" ? "Accessories" : "Clothing")
        });
    }

    return products;
}

export { SIZES };
