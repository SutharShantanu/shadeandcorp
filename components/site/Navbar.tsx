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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Dot } from "../ui/dot";

const categories = [
  {
    title: "Men",
    items: [
      { title: "T-Shirts", href: "/products/men/clothing/t-shirts" },
      { title: "Casual Shirts", href: "/products/men/clothing/casual-shirts" },
      { title: "Formal Shirts", href: "/products/men/clothing/formal-shirts" },
      { title: "Jeans", href: "/products/men/clothing/jeans" },
      { title: "Casual Trousers", href: "/products/men/clothing/casual-trousers" },
      { title: "Formal Trousers", href: "/products/men/clothing/formal-trousers" },
      { title: "Shorts", href: "/products/men/clothing/shorts" },
      { title: "Jackets", href: "/products/men/clothing/jackets" },
      { title: "Blazers", href: "/products/men/clothing/blazers" },
      { title: "Sweaters", href: "/products/men/clothing/sweaters" },
      { title: "Sweatshirts", href: "/products/men/clothing/sweatshirts" },
      { title: "Activewear", href: "/products/men/clothing/activewear" },
    ],
    image: "/images/men-category.jpg",
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
    image: "/images/women-category.jpg",
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
    image: "/images/kids-category.jpg",
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
    image: "/images/collections.jpg",
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
    image: "/images/accessories.jpg",
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
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.title}>
            <NavigationMenuTrigger className="bg-transparent">{category.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[800px] p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {category.title}
                      </h3>
                      <Link
                        href={`/products/${category.title.toLowerCase()}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        View All
                      </Link>
                    </div>
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

                    {(category.title === "Men" ||
                      category.title === "Women" ||
                      category.title === "Kids") && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-3">Shop by Category</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {detailedCategories[
                              category.title.toLowerCase() as keyof typeof detailedCategories
                            ]?.map((subcat) => (
                              <div key={subcat.title}>
                                <h5 className="text-sm font-medium mb-2">
                                  {subcat.title}
                                </h5>
                                <div className="space-y-1">
                                  {subcat.items.map((item) => (
                                    <Link
                                      key={item}
                                      href={`/products/${category.title.toLowerCase()}/${subcat.title.toLowerCase()}/${item.toLowerCase().replace(/ /g, '-')}`}
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
                      alt={category.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <Link
                        href={`/products/${category.title.toLowerCase()}`}
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
            <Kbd>Ctrl</Kbd>
            +
            <Kbd>K</Kbd>
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

  const profileNotifications = getNotificationsByCategory(notifications, "profile");
  const orderNotifications = getNotificationsByCategory(notifications, "orders");
  const settingsNotifications = getNotificationsByCategory(notifications, "settings");

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
              <Dot
                className="ml-auto"
                variant="info"
              />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/orders")}
            className="relative"
          >
            <ShoppingBag className="size-4" />
            <span>My Orders</span>
            {orderNotifications.length > 0 && (
              <Dot
                className="ml-auto"
                variant="success"
              />
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
              <Dot
                className="ml-auto"
                variant="warning"
              />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/payment-methods")}
            className="relative"
          >
            <CreditCard className="size-4" />
            <span>Payment Methods</span>
            {session.user?.hasMissingPayment && (
              <Dot
                className="ml-auto"
                variant="warning"
              />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/notifications")}
            className="relative"
          >
            <Bell className="size-4" />
            <span>Notifications</span>
            {settingsNotifications.length > 0 && (
              <Dot
                className="ml-auto"
                variant="info"
              />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
            <Settings className="size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            variant="destructive"
          >
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
          <Menu className="h-5 w-5" />
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
  const wishlistCount = useAppSelector((s: { wishlist: { items: unknown[] } }) => s.wishlist.items.length);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm shadow-sm ${className}`}>
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
