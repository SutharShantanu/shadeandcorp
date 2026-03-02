"use client";

import Link from "next/link";
import Image from "next/image";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  BadgeCheck,
  CreditCard,
  MapPin,
  Bell,
  BadgeInfo,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/ui/menu";
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
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AvatarBadge from "@/components/site/AvatarBadge";
import { useAppSelector } from "@/lib/store";
import { getNotificationsByCategory } from "@/lib/notificationUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Dot } from "../ui/dot";
import { Separator } from "../ui/separator";

const categories = [
  {
    title: "Men",
    items: [
      { title: "T-Shirts", href: "/products/men/clothing/t-shirts" },
      { title: "Casual Shirts", href: "/products/men/clothing/casual-shirts" },
      { title: "Formal Shirts", href: "/products/men/clothing/formal-shirts" },
      { title: "Jeans", href: "/products/men/clothing/jeans" },
      {
        title: "Casual Trousers",
        href: "/products/men/clothing/casual-trousers",
      },
      {
        title: "Formal Trousers",
        href: "/products/men/clothing/formal-trousers",
      },
      { title: "Shorts", href: "/products/men/clothing/shorts" },
      { title: "Jackets", href: "/products/men/clothing/jackets" },
      { title: "Blazers", href: "/products/men/clothing/blazers" },
      { title: "Sweaters", href: "/products/men/clothing/sweaters" },
      { title: "Sweatshirts", href: "/products/men/clothing/sweatshirts" },
      { title: "Activewear", href: "/products/men/clothing/activewear" },
    ],
    image:
      "https://images.unsplash.com/photo-1488161628813-99425260dead?w=400&h=300&fit=crop",
  },
  {
    title: "Women",
    items: [
      { title: "Dresses", href: "/products/women/clothing/dresses" },
      { title: "Tops", href: "/products/women/clothing/tops" },
      { title: "T-Shirts", href: "/products/women/clothing/t-shirts" },
      { title: "Jeans", href: "/products/women/clothing/jeans" },
      { title: "Trousers", href: "/products/women/clothing/trousers" },
      { title: "Skirts", href: "/products/women/clothing/skirts" },
      { title: "Jumpsuits", href: "/products/women/clothing/jumpsuits" },
      { title: "Blouses", href: "/products/women/clothing/blouses" },
      { title: "Sweaters", href: "/products/women/clothing/sweaters" },
      { title: "Jackets", href: "/products/women/clothing/jackets" },
      { title: "Activewear", href: "/products/women/clothing/activewear" },
      { title: "Lingerie", href: "/products/women/clothing/lingerie" },
    ],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
  },
  {
    title: "Kids",
    items: [
      { title: "Boys Clothing", href: "/products/kids/clothing/boys" },
      { title: "Girls Clothing", href: "/products/kids/clothing/girls" },
      { title: "Infants", href: "/products/kids/clothing/infants" },
      { title: "School Uniforms", href: "/products/kids/clothing/uniforms" },
      { title: "Party Wear", href: "/products/kids/clothing/party-wear" },
      { title: "Footwear", href: "/products/kids/clothing/footwear" },
      { title: "Accessories", href: "/products/kids/clothing/accessories" },
      { title: "Winter Wear", href: "/products/kids/clothing/winter-wear" },
    ],
    image:
      "https://images.unsplash.com/photo-1540331547168-8b6310d425f9?w=400&h=300&fit=crop",
  },
  {
    title: "Collections",
    items: [
      { title: "Summer 2025", href: "/products/collections/summer-2025" },
      { title: "Winter Essentials", href: "/products/collections/winter" },
      { title: "Active Wear", href: "/products/collections/active" },
      { title: "Loungewear", href: "/products/collections/lounge" },
      { title: "Festive Collection", href: "/products/collections/festive" },
      { title: "Premium Collection", href: "/products/collections/premium" },
    ],
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
  },
  {
    title: "Accessories",
    items: [
      { title: "Bags & Backpacks", href: "/products/accessories/bags" },
      { title: "Watches", href: "/products/accessories/watches" },
      { title: "Sunglasses", href: "/products/accessories/sunglasses" },
      { title: "Belts", href: "/products/accessories/belts" },
      { title: "Wallets", href: "/products/accessories/wallets" },
      { title: "Jewelry", href: "/products/accessories/jewelry" },
      { title: "Hats & Caps", href: "/products/accessories/hats" },
      { title: "Scarves", href: "/products/accessories/scarves" },
    ],
    image:
      "https://images.unsplash.com/photo-1576053139778-7e32f5f09437?w=400&h=300&fit=crop",
  },
];

const detailedCategories = {
  men: [
    {
      title: "Topwear",
      items: [
        "T-Shirts",
        "Casual Shirts",
        "Formal Shirts",
        "Sweaters",
        "Sweatshirts",
        "Jackets",
      ],
    },
    {
      title: "Bottomwear",
      items: [
        "Jeans",
        "Casual Trousers",
        "Formal Trousers",
        "Shorts",
        "Track Pants",
      ],
    },
    {
      title: "Footwear",
      items: [
        "Casual Shoes",
        "Sports Shoes",
        "Formal Shoes",
        "Sandals",
        "Sneakers",
      ],
    },
    {
      title: "Accessories",
      items: ["Watches", "Belts", "Wallets", "Sunglasses", "Bags", "Caps"],
    },
  ],
  women: [
    {
      title: "Western Wear",
      items: ["Dresses", "Tops", "T-Shirts", "Jeans", "Trousers", "Skirts"],
    },
    {
      title: "Indian Wear",
      items: ["Kurtas", "Sarees", "Lehengas", "Salwar Suits", "Blouses"],
    },
    {
      title: "Footwear",
      items: ["Heels", "Flats", "Sandals", "Sports Shoes", "Boots"],
    },
    {
      title: "Beauty & Accessories",
      items: ["Jewelry", "Handbags", "Watches", "Sunglasses", "Scarves"],
    },
  ],
  kids: [
    {
      title: "Boys (2-16 Years)",
      items: ["T-Shirts", "Shirts", "Jeans", "Shorts", "Jackets", "Sportswear"],
    },
    {
      title: "Girls (2-16 Years)",
      items: ["Dresses", "Tops", "Skirts", "Jeans", "Leggings", "Party Wear"],
    },
    {
      title: "Infants (0-2 Years)",
      items: [
        "Rompers",
        "Bodysuits",
        "Sleepwear",
        "Winter Wear",
        "Accessories",
      ],
    },
    {
      title: "Toys & Accessories",
      items: ["Backpacks", "Shoes", "Hats", "Water Bottles", "Stationery"],
    },
  ],
};

interface CategoryNavigationProps {
  className?: string;
}

export function CategoryNavigation({ className }: CategoryNavigationProps) {
  const router = useRouter();
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {categories.map((category) => {
          const hasDetailedCategories =
            category.title === "Men" ||
            category.title === "Women" ||
            category.title === "Kids";
          return (
            <NavigationMenuItem key={category.title}>
              <NavigationMenuTrigger className="bg-transparent h-9 px-4 py-2">
                {category.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  className={`p-2 lg:p-4 ${hasDetailedCategories ? "w-3xl lg:w-5xl" : "w-xl lg:w-3xl"}`}
                >
                  <div
                    className={`grid gap-4 lg:gap-8 ${hasDetailedCategories ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-2"}`}
                  >
                    {/* First Column: Featured Links */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {category.title}
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/products/${category.title.toLowerCase()}`,
                            )
                          }
                          className="text-sm flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          View All <ChevronRight size="16" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                              {item.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Second Column: Detailed Categories (Conditional) */}
                    {hasDetailedCategories && (
                      <div className="flex items-center gap-1">
                        <Separator orientation="vertical" className="h-full" />
                        <div className="flex flex-col gap-4 pl-2">
                          <h3 className="text-lg font-semibold tracking-tight">
                            Shop by Category
                          </h3>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {detailedCategories[
                              category.title.toLowerCase() as keyof typeof detailedCategories
                            ]?.map((subcat) => (
                              <div key={subcat.title} className="space-y-3">
                                <h5 className="text-sm font-semibold text-foreground/90">
                                  {subcat.title}
                                </h5>
                                <ul className="space-y-2">
                                  {subcat.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href={`/products/${category.title.toLowerCase()}/${subcat.title.toLowerCase()}/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Third Column: Image Banner */}
                    <div className="relative rounded-xl overflow-hidden group h-full min-h-[300px]">
                      <Image
                        width={400}
                        height={300}
                        src={category.image}
                        alt={category.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <h4 className="text-white font-semibold text-lg mb-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {category.title}
                        </h4>
                        <p className="text-white/80 text-xs mb-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 line-clamp-2">
                          Discover the latest trends and essential styles.
                        </p>
                        <Link
                          href={`/products/${category.title.toLowerCase()}`}
                          className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 h-8 px-3 py-1 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500 delay-150"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase?.();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`flex w-1/3 items-center ${className}`}>
      <InputGroup className="border-transparent shadow-none">
        <InputGroupInput
          ref={inputRef}
          placeholder="Search products..."
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon className="cursor-pointer" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
interface ActionButtonsProps {
  wishlistCount?: number;
  cartCount?: number;
  className?: string;
}

export function ActionButtons({
  wishlistCount = 0,
  cartCount = 0,
  className,
}: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
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
      </div>
    </TooltipProvider>
  );
}
interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={() => router.push("/login")}
          size="sm"
          variant="outline"
        >
          Login
        </Button>
        <Button
          variant="default"
          onClick={() => router.push("/signup")}
          size="sm"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    signOut();
    router.push("/");
  };

  const notifications = session.user?.notifications || [];

  const profileNotifications = getNotificationsByCategory(
    notifications,
    "profile",
  );
  const orderNotifications = getNotificationsByCategory(
    notifications,
    "orders",
  );
  const settingsNotifications = getNotificationsByCategory(
    notifications,
    "settings",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full transition-all"
        >
          <AvatarBadge />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="end"
        forceMount
        sideOffset={8}
      >
        <TooltipProvider>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  {session.user?.name}
                  {session.user?.isEmailVerified ? (
                    <BadgeCheck className="h-4 w-4" />
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BadgeInfo className="h-4 w-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your email is not verified.</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </p>
              </div>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </TooltipProvider>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=profile")}
            className="relative"
          >
            <User className="size-4" />
            <span>Profile</span>
            {profileNotifications.length > 0 && (
              <Dot className="ml-auto" variant="info" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/orders")}
            className="relative"
          >
            <ShoppingBag className="size-4" />
            <span>My Orders</span>
            {orderNotifications.length > 0 && (
              <Dot className="ml-auto" variant="success" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/wishlist")}
            className="relative"
          >
            <Heart className="size-4" />
            <span>Wishlist</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigation("/addresses")}
            className="relative"
          >
            <MapPin className="size-4" />
            <span>Addresses</span>
            {session.user?.hasMissingAddress && (
              <Dot className="ml-auto" variant="warning" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/payment-methods")}
            className="relative"
          >
            <CreditCard className="size-4" />
            <span>Payment Methods</span>
            {session.user?.hasMissingPayment && (
              <Dot className="ml-auto" variant="warning" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/notifications")}
            className="relative"
          >
            <Bell className="size-4" />
            <span>Notifications</span>
            {settingsNotifications.length > 0 && (
              <Dot className="ml-auto" variant="info" />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
            <Settings className="size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOut className="size-4" />
            <span className="text-destructive">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
interface MobileMenuProps {
  categories: Array<{
    title: string;
    items: Array<{ title: string; href: string }>;
  }>;
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Browse our collections and categories
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-8">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <div className="grid grid-cols-1 gap-1 pl-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
export default function Navbar({ className }: { className?: string }) {
  const cartCount = 3;
  // Read wishlist count from Redux
  const wishlistCount = useAppSelector(
    (s: { wishlist: { items: unknown[] } }) => s.wishlist.items.length,
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-sm shadow-sm ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 py-4">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <MobileMenu categories={categories} />

          <Link href="/" className="text-2xl font-bold font-body md:text-4xl">
            Shade & Co
          </Link>
        </div>

        {/* Center Section - Navigation & Search */}
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <CategoryNavigation />
          <SearchBar />
        </nav>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          <ActionButtons wishlistCount={wishlistCount} cartCount={cartCount} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
