"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Badge } from "../ui/badge";
import NumberFlow from "@number-flow/react";

type Product = {
    id: string;
    title: string;
    price: string;
    image: string;
    category: "trending" | "sale" | "winter" | "festival";
};

const products: Product[] = [
    {
        id: "1",
        title: "Winter Special Jacket",
        price: "$129.99",
        image: "https://picsum.photos/400/400?1",
        category: "winter",
    },
    {
        id: "2",
        title: "Festival Collection Dress",
        price: "$89.99",
        image: "https://picsum.photos/400/400?2",
        category: "festival",
    },
    {
        id: "3",
        title: "Trending Sneakers",
        price: "$79.99",
        image: "https://picsum.photos/400/400?3",
        category: "trending",
    },
    {
        id: "4",
        title: "Holiday Special Watch",
        price: "$199.99",
        image: "https://picsum.photos/400/400?4",
        category: "sale",
    },
    // Add more products as needed
];

const CountdownTimer = ({ endDate }: { endDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div className="flex gap-4 text-center">
            <div className="flex flex-col">
                <NumberFlow
                    className="text-2xl font-bold min-w-[3ch]"
                    value={timeLeft.days}
                    format={{ format: (n) => n.toFixed(0).padStart(2, "0") }}
                />
                <span className="text-sm text-muted-foreground">Days</span>
            </div>
            <div className="flex flex-col">
                <NumberFlow
                    className="text-2xl font-bold min-w-[3ch]"
                    value={timeLeft.hours}
                    format={{ format: (n) => n.toFixed(0).padStart(2, "0") }}
                />
                <span className="text-sm text-muted-foreground">Hours</span>
            </div>
            <div className="flex flex-col">
                <NumberFlow
                    className="text-2xl font-bold min-w-[3ch]"
                    value={timeLeft.minutes}
                    format={{ format: (n) => n.toFixed(0).padStart(2, "0") }}
                />
                <span className="text-sm text-muted-foreground">Minutes</span>
            </div>
            <div className="flex flex-col">
                <NumberFlow
                    className="text-2xl font-bold min-w-[3ch]"
                    value={timeLeft.seconds}
                    format={{ format: (n) => n.toFixed(0).padStart(2, "0") }}
                />
                <span className="text-sm text-muted-foreground">Seconds</span>
            </div>
        </div>
    );
};

export default function TrendingProducts() {
    // Set sale end date to 7 days from now
    const saleEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

    const [selectedCategory, setSelectedCategory] = useState<
        Product["category"] | "all"
    >("all");

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((product) => product.category === selectedCategory);

    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 flex flex-col items-center gap-4">
                <h2 className="text-3xl font-bold">Special Offers & Collections</h2>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Sale Ends In:</Badge>
                    <CountdownTimer endDate={saleEndDate} />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
                {(["all", "trending", "sale", "winter", "festival"] as const).map(
                    (category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    )
                )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}