"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Search, ShoppingCart, User, Heart } from "lucide-react";
import Link from "next/link";

const menuLinks = [
    {
        href: "/shop/men",
        label: "Men",
        icon: <User className="w-5 h-5" />,
        subcategories: [
            "T-Shirts", "Jeans", "Shirts", "Jackets", "Footwear", "Suits", "Activewear", "Accessories"
        ]
    },
    {
        href: "/shop/women",
        label: "Women",
        icon: <User className="w-5 h-5" />,
        subcategories: [
            "Dresses", "Tops", "Skirts", "Jeans", "Shirts", "Sweaters", "Footwear", "Bags", "Jewelry"
        ]
    },
    {
        href: "/shop/accessories",
        label: "Accessories",
        icon: <Heart className="w-5 h-5" />,
        subcategories: [
            "Watches", "Bags", "Jewelry", "Sunglasses", "Wallets", "Belts", "Hats", "Caps"
        ]
    },
    {
        href: "/shop/footwear",
        label: "Footwear",
        icon: <ShoppingCart className="w-5 h-5" />,
        subcategories: [
            "Men's Shoes", "Women's Shoes", "Kids' Shoes", "Sports Shoes", "Boots", "Flip-flops"
        ]
    },
    {
        href: "/offers",
        label: "Offers",
        icon: <Search className="w-5 h-5" />
    },
    {
        href: "/new-arrivals",
        label: "New Arrivals",
        icon: <ShoppingCart className="w-5 h-5" />
    },
    {
        href: "/contact",
        label: "Contact",
        icon: <User className="w-5 h-5" />
    },
    {
        href: "/faq",
        label: "FAQ",
        icon: <Search className="w-5 h-5" />
    },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <div
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-sm bg-primary-foreground" : "bg-transparent"
                    }`}
                role="navigation"
            >
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <Link href="/">
                        <div className="text-2xl font-bold text-primary">Shade & Co.</div>
                    </Link>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid grid-cols-2 gap-4 p-4">
                                        {menuLinks.slice(0, 3).map((link) => (
                                            <li key={link.href} className="flex items-center gap-x-2">
                                                {link.icon}
                                                <NavigationMenuLink asChild>
                                                    <Link href={link.href} className="text-primary-default hover:text-accent-foreground">
                                                        {link.label}
                                                    </Link>
                                                </NavigationMenuLink>
                                                <ul className="pl-6 text-sm">
                                                    {link.subcategories.map((subcategory, index) => (
                                                        <li key={index} className="text-primary-foreground hover:text-accent-foreground">
                                                            {subcategory}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger >More</NavigationMenuTrigger>
                                <NavigationMenuContent >
                                    <ul className="p-4">
                                        {menuLinks.slice(3).map((link) => (
                                            <li key={link.href} className="flex items-center gap-x-2">
                                                {link.icon}
                                                <NavigationMenuLink asChild>
                                                    <Link href={link.href} className="text-primary-default hover:text-accent-foreground">
                                                        {link.label}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="hidden md:flex items-center gap-x-4">
                        <Link href="/wishlist">
                            <Heart className="w-6 h-6 text-primary-foreground hover:text-accent-foreground cursor-pointer" aria-label="Wishlist" />
                        </Link>
                        <Link href="/cart">
                            <ShoppingCart className="w-6 h-6 text-primary-foreground hover:text-accent-foreground cursor-pointer" aria-label="Cart" />
                        </Link>
                        <Link href="/account">
                            <User className="w-6 h-6 text-primary-foreground hover:text-accent-foreground cursor-pointer" aria-label="Account" />
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger>
                                <Menu className="w-6 h-6 text-primary-foreground hover:text-accent-foreground cursor-pointer" aria-label="Open menu" />
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-background">
                                <SheetHeader>
                                    <SheetTitle className="text-primary-foreground">Menu</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-y-4 mt-4">
                                    {menuLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className="text-lg font-medium text-primary-foreground hover:text-accent-foreground">
                                            {link.icon} {link.label}
                                        </Link>
                                    ))}
                                    <div className="mt-4">
                                        <button
                                            className="absolute top-4 right-4 text-primary-foreground"
                                            onClick={() => document.activeElement.blur()}
                                            aria-label="Close menu"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
