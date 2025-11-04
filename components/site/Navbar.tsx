"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Menu,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  User,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categories = [
  {
    title: "Men",
    items: [
      { title: "T-Shirts", href: "/men/t-shirts" },
      { title: "Casual Shirts", href: "/men/casual-shirts" },
      { title: "Formal Shirts", href: "/men/formal-shirts" },
      { title: "Jeans", href: "/men/jeans" },
      { title: "Casual Trousers", href: "/men/casual-trousers" },
      { title: "Formal Trousers", href: "/men/formal-trousers" },
      { title: "Shorts", href: "/men/shorts" },
      { title: "Jackets", href: "/men/jackets" },
      { title: "Blazers", href: "/men/blazers" },
      { title: "Sweaters", href: "/men/sweaters" },
      { title: "Sweatshirts", href: "/men/sweatshirts" },
      { title: "Activewear", href: "/men/activewear" },
    ],
    image: "/images/men-category.jpg",
  },
  {
    title: "Women",
    items: [
      { title: "Dresses", href: "/women/dresses" },
      { title: "Tops", href: "/women/tops" },
      { title: "T-Shirts", href: "/women/t-shirts" },
      { title: "Jeans", href: "/women/jeans" },
      { title: "Trousers", href: "/women/trousers" },
      { title: "Skirts", href: "/women/skirts" },
      { title: "Jumpsuits", href: "/women/jumpsuits" },
      { title: "Blouses", href: "/women/blouses" },
      { title: "Sweaters", href: "/women/sweaters" },
      { title: "Jackets", href: "/women/jackets" },
      { title: "Activewear", href: "/women/activewear" },
      { title: "Lingerie", href: "/women/lingerie" },
    ],
    image: "/images/women-category.jpg",
  },
  {
    title: "Kids",
    items: [
      { title: "Boys Clothing", href: "/kids/boys" },
      { title: "Girls Clothing", href: "/kids/girls" },
      { title: "Infants", href: "/kids/infants" },
      { title: "School Uniforms", href: "/kids/school-uniforms" },
      { title: "Party Wear", href: "/kids/party-wear" },
      { title: "Footwear", href: "/kids/footwear" },
      { title: "Accessories", href: "/kids/accessories" },
      { title: "Winter Wear", href: "/kids/winter-wear" },
    ],
    image: "/images/kids-category.jpg",
  },
  {
    title: "Collections",
    items: [
      { title: "Summer 2025", href: "/collections/summer-2025" },
      { title: "Winter Essentials", href: "/collections/winter" },
      { title: "Active Wear", href: "/collections/active" },
      { title: "Loungewear", href: "/collections/lounge" },
      { title: "Festive Collection", href: "/collections/festive" },
      { title: "Premium Collection", href: "/collections/premium" },
    ],
    image: "/images/collections.jpg",
  },
  {
    title: "Accessories",
    items: [
      { title: "Bags & Backpacks", href: "/accessories/bags" },
      { title: "Watches", href: "/accessories/watches" },
      { title: "Sunglasses", href: "/accessories/sunglasses" },
      { title: "Belts", href: "/accessories/belts" },
      { title: "Wallets", href: "/accessories/wallets" },
      { title: "Jewelry", href: "/accessories/jewelry" },
      { title: "Hats & Caps", href: "/accessories/hats" },
      { title: "Scarves", href: "/accessories/scarves" },
    ],
    image: "/images/accessories.jpg",
  },
];

// Subcategories for detailed dropdowns
const detailedCategories = {
  men: [
    {
      title: "Topwear",
      items: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Sweaters", "Sweatshirts", "Jackets"]
    },
    {
      title: "Bottomwear",
      items: ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Track Pants"]
    },
    {
      title: "Footwear",
      items: ["Casual Shoes", "Sports Shoes", "Formal Shoes", "Sandals", "Sneakers"]
    },
    {
      title: "Accessories",
      items: ["Watches", "Belts", "Wallets", "Sunglasses", "Bags", "Caps"]
    }
  ],
  women: [
    {
      title: "Western Wear",
      items: ["Dresses", "Tops", "T-Shirts", "Jeans", "Trousers", "Skirts"]
    },
    {
      title: "Indian Wear",
      items: ["Kurtas", "Sarees", "Lehengas", "Salwar Suits", "Blouses"]
    },
    {
      title: "Footwear",
      items: ["Heels", "Flats", "Sandals", "Sports Shoes", "Boots"]
    },
    {
      title: "Beauty & Accessories",
      items: ["Jewelry", "Handbags", "Watches", "Sunglasses", "Scarves"]
    }
  ],
  kids: [
    {
      title: "Boys (2-16 Years)",
      items: ["T-Shirts", "Shirts", "Jeans", "Shorts", "Jackets", "Sportswear"]
    },
    {
      title: "Girls (2-16 Years)",
      items: ["Dresses", "Tops", "Skirts", "Jeans", "Leggings", "Party Wear"]
    },
    {
      title: "Infants (0-2 Years)",
      items: ["Rompers", "Bodysuits", "Sleepwear", "Winter Wear", "Accessories"]
    },
    {
      title: "Toys & Accessories",
      items: ["Backpacks", "Shoes", "Hats", "Water Bottles", "Stationery"]
    }
  ]
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase?.();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setSearch(true);
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  
  const { data: session } = useSession();

  const cartCount = 3;
  const wishlistCount = 5;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
                aria-label="menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Browse our collections and categories
                </SheetDescription>
              </SheetHeader>
              {/* Mobile navigation content */}
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-4xl font-bold font-body">
            Shade & Co
          </Link>
        </div>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.title}>
                  <NavigationMenuTrigger>
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold">{category.title} Collection</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {category.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <div className="h-2 w-2 rounded-full bg-zinc-300 group-hover:bg-zinc-600" />
                                <span className="text-sm">{item.title}</span>
                              </Link>
                            ))}
                          </div>
                          
                          {/* Detailed subcategories for main categories */}
                          {(category.title === "Men" || category.title === "Women" || category.title === "Kids") && (
                            <div className="pt-4 border-t">
                              <h4 className="font-medium mb-3">Shop by Category</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {detailedCategories[category.title.toLowerCase() as keyof typeof detailedCategories]?.map((subcat) => (
                                  <div key={subcat.title}>
                                    <h5 className="text-sm font-medium mb-2">{subcat.title}</h5>
                                    <div className="space-y-1">
                                      {subcat.items.map((item) => (
                                        <Link
                                          key={item}
                                          href={`/${category.title.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                          className="block text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                        >
                                          {item}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="relative rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          <Image
                            src={category.image}
                            alt={`${category.title} Collection`}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <Link 
                              href={`/${category.title.toLowerCase()}`}
                              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Shop {category.title}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex w-1/3 items-center relative">
            <Input
              ref={inputRef}
              placeholder="Search products..."
              className="pl-10"
              onClick={() => setSearch(true)}
              aria-label="Search products"
            />
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Kbd className="absolute right-3 pointer-events-none">Ctrl + K</Kbd>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5 fill-red-400 stroke-red-400" />
                    {wishlistCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {wishlistCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Wishlist</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none flex items-center gap-1">
                        {session.user?.name}
                        <BadgeCheck className="h-4 w-4 text-blue-500" />
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                  size="sm"
                >
                  Login
                </Button>

                <Link href="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}