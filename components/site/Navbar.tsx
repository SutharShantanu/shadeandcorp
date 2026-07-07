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
  CreditCard,
  MapPin,
  ChevronRight,
  ArrowRight,
  Eye,
  Shirt,
  Scissors,
  Briefcase,
  Footprints,
  Sun,
  Moon,
  Snowflake,
  Sparkles,
  Baby,
  Watch,
  Glasses,
  Gem,
  Star,
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
import { ExpandableButton } from "@/components/extended/button";
import AvatarBadge from "@/components/site/AvatarBadge";
import { useAppSelector } from "@/lib/store";
import { getNotificationsByCategory } from "@/lib/domain/notificationUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Dot } from "../ui/dot";

const getCategoryImageUrl = (title: string) => {
  const t = title.toLowerCase();
  if (
    t.includes("shirt") ||
    t.includes("top") ||
    t.includes("sweater") ||
    t.includes("clothing")
  )
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop";
  if (
    t.includes("jean") ||
    t.includes("trouser") ||
    t.includes("short") ||
    t.includes("legging")
  )
    return "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop";
  if (t.includes("active") || t.includes("footwear") || t.includes("shoe"))
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop";
  if (t.includes("winter") || t.includes("snow") || t.includes("jacket"))
    return "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop";
  if (t.includes("watch") || t.includes("glass") || t.includes("accessor"))
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop";
  if (t.includes("bag") || t.includes("wallet"))
    return "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=100&h=100&fit=crop";
  if (t.includes("dress") || t.includes("skirt"))
    return "https://images.unsplash.com/photo-1515347619152-19c2e0b57134?w=100&h=100&fit=crop";
  if (t.includes("suit") || t.includes("blazer"))
    return "https://images.unsplash.com/photo-1594938298596-70f58fb3ba68?w=100&h=100&fit=crop";
  if (t.includes("inner") || t.includes("lingerie"))
    return "https://images.unsplash.com/photo-1590544158496-d24269d03a11?w=100&h=100&fit=crop";
  if (t.includes("baby") || t.includes("infant"))
    return "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop";
  if (t.includes("jewel") || t.includes("premium"))
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop";
  if (t.includes("summer") || t.includes("sun"))
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop";
  if (t.includes("night") || t.includes("sleep") || t.includes("lounge"))
    return "https://images.unsplash.com/photo-1606132711717-b73f71c4d7ec?w=100&h=100&fit=crop";
  if (
    t.includes("ethnic") ||
    t.includes("kurta") ||
    t.includes("saree") ||
    t.includes("festive") ||
    t.includes("party")
  )
    return "https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?w=100&h=100&fit=crop";

  return "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop";
};

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
      { title: "Loungewear", href: "/products/men/clothing/loungewear" },
      { title: "Innerwear", href: "/products/men/clothing/innerwear" },
      { title: "Nightwear", href: "/products/men/clothing/nightwear" },
      { title: "Winterwear", href: "/products/men/clothing/winterwear" },
      { title: "Suits", href: "/products/men/clothing/suits" },
      { title: "Ethnic Wear", href: "/products/men/clothing/ethnic" },
    ],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
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
      { title: "Kurtas & Kurtis", href: "/products/women/clothing/kurtas" },
      { title: "Ethnic Wear", href: "/products/women/clothing/ethnic" },
      { title: "Sarees", href: "/products/women/clothing/sarees" },
      { title: "Leggings", href: "/products/women/clothing/leggings" },
      { title: "Sleepwear", href: "/products/women/clothing/sleepwear" },
      { title: "Loungewear", href: "/products/women/clothing/loungewear" },
    ],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
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
  const [featuredBadgeText, setFeaturedBadgeText] = useState(
    "Featured Collection",
  );

  useEffect(() => {
    fetch("/api/settings?key=featuredBadgeText")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFeaturedBadgeText(data.data);
        }
      })
      .catch((err) => console.error("Error fetching setting:", err));
  }, []);

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
              <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="overflow-hidden w-5xl">
                  <div className="grid lg:grid-cols-3">
                    {/* Left Content */}
                    <div className="p-4 lg:p-6 flex flex-col col-span-2 gap-4 space-4">
                      <Badge variant="secondary">{featuredBadgeText}</Badge>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Discover our curated selection of premium products.
                          </p>
                        </div>

                        <ExpandableButton
                          text="View All"
                          onClick={() =>
                            router.push(
                              `/products/${category.title.toLowerCase()}`,
                            )
                          }
                        />
                      </div>

                      {/* Featured Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {category.items.slice(0, 6).map((item: any) => (
                          <Link key={item.title} href={item.href}>
                            <Card className="group h-full bg-muted ring-0">
                              <CardContent>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    {/* Image Placeholder */}
                                    <div className="h-10 w-10 shrink-0 rounded-md bg-muted overflow-hidden relative">
                                      <Image
                                        src={
                                          item.image ||
                                          getCategoryImageUrl(item.title)
                                        }
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                                        {item.title}
                                      </h4>

                                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                        Explore collection
                                      </p>
                                    </div>
                                  </div>

                                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>

                      {hasDetailedCategories && (
                        <>
                          <div>
                            <div className="mb-4 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="uppercase tracking-wider"
                              >
                                Shop by category
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                              {detailedCategories[
                                category.title.toLowerCase() as keyof typeof detailedCategories
                              ]?.map((subcat) => (
                                <div key={subcat.title}>
                                  <div className="pb-3">
                                    <p className="text-sm">{subcat.title}</p>
                                  </div>

                                  <CardContent className="pt-0">
                                    <div className="space-y-2">
                                      {subcat.items.slice(0, 5).map((item) => (
                                        <Link
                                          key={item}
                                          href={`/products/${category.title.toLowerCase()}/${subcat.title.toLowerCase()}/${item
                                            .toLowerCase()
                                            .replace(/ /g, "-")}`}
                                          className="group flex items-center gap-3 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        >
                                          <Dot className="opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                                          <span>{item}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </CardContent>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Promo Banner */}
                    <div className="relative border-l border-border/50">
                      <div className="relative h-full min-h-[500px] overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <Badge className="mb-3 w-fit">New Arrivals</Badge>

                          <h3 className="text-3xl font-bold text-white leading-tight">
                            {category.title}
                            <br />
                            Collection
                          </h3>

                          <p className="mt-3 text-sm text-white/80">
                            Premium quality products crafted for modern
                            lifestyles.
                          </p>

                          <div className="mt-6 flex gap-2">
                            <Button asChild size="sm" className="group">
                              <Link
                                href={`/products/${category.title.toLowerCase()}`}
                              >
                                Shop Collection
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>

                            <Button asChild variant="secondary" size="sm">
                              <Link
                                href={`/products/${category.title.toLowerCase()}`}
                              >
                                Explore
                              </Link>
                            </Button>
                          </div>

                          <div className="mt-8 grid grid-cols-3 gap-3">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  500+
                                </p>
                                <p className="text-[10px] text-white/70">
                                  Products
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  4.8★
                                </p>
                                <p className="text-[10px] text-white/70">
                                  Rating
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  24h
                                </p>
                                <p className="text-[10px] text-white/70">
                                  Dispatch
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
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
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

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
    <div className={`flex max-w-2xs w-full items-center ${className}`}>
      <InputGroup>
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
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <Heart
                  className="h-5 w-5 fill-red-400 stroke-red-400"
                  aria-hidden="true"
                />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    size="xs"
                    className="absolute -top-2 -right-2 rounded-full px-1"
                    aria-hidden="true"
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
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="User menu"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    size="xs"
                    className="absolute -top-2 -right-2 rounded-full px-1"
                    aria-hidden="true"
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
    await signOut({ redirect: false });
    router.push("/");
  };

  const notifications = session.user?.notifications || [];
  const orderNotifications = getNotificationsByCategory(
    notifications,
    "orders",
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`User Menu`}
        >
          <AvatarBadge />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit min-w-64" align="end">
        <div className="px-2 py-2 mb-2 flex items-center gap-3 border-b border-zinc-100/80 pb-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center border border-zinc-200 shadow-sm">
            <User size={18} className="text-zinc-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">
              {session.user?.name || "Member"}
            </p>
            <p className="text-[11px] font-medium text-zinc-500 truncate">
              {session.user?.email || "Welcome back!"}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=orders")}
          >
            <ShoppingBag size={15} />
            <span className="text-sm font-medium">Orders</span>
            {orderNotifications.length > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white shadow-sm">
                {orderNotifications.length}
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleNavigation("/wishlist")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-zinc-200/60 transition-all">
              <Heart
                size={15}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <span className="text-sm font-medium">Wishlist</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="mx-2 my-1.5 opacity-50" />

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=profile")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors focus:bg-zinc-100/80 focus:text-zinc-900 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-zinc-200/60 transition-all">
              <User
                size={15}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <span className="text-sm font-medium">Personal Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=addresses")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors focus:bg-zinc-100/80 focus:text-zinc-900 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-zinc-200/60 transition-all">
              <MapPin
                size={15}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <span className="text-sm font-medium">Saved Addresses</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=billing")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors focus:bg-zinc-100/80 focus:text-zinc-900 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-zinc-200/60 transition-all">
              <CreditCard
                size={15}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <span className="text-sm font-medium">Payment Methods</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="mx-2 my-1.5 opacity-50" />

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=security")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors focus:bg-zinc-100/80 focus:text-zinc-900 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-zinc-200/60 transition-all">
              <Settings
                size={15}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 group mt-1"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50/50 group-hover:bg-red-100 group-hover:shadow-sm border border-transparent group-hover:border-red-200/60 transition-all">
              <LogOut
                size={15}
                className="text-red-500 group-hover:text-red-600 transition-colors"
              />
            </div>
            <span className="text-sm font-semibold">Log out</span>
          </DropdownMenuItem>
        </div>
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

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/shadeandcorp_log.svg"
              alt="Shade & Corp"
              width={100}
              height={100}
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </div>

        {/* Center Section - Navigation & Search */}
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <CategoryNavigation />
        </nav>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <ActionButtons wishlistCount={wishlistCount} cartCount={cartCount} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
