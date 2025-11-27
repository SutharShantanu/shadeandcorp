"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Package,
  MapPin,
  Search,
  Lock,
  PencilLine,
  Info,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileDisplayTab from "@/components/profile/ProfileDisplayTab";
import AccountDisplayTab from "@/components/profile/AccountDisplayTab";
import BillingTab from "@/components/profile/BillingTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import OrdersTab from "@/components/profile/OrdersTab";
import AddressesTab from "@/components/profile/AddressesTab";
import SecurityTab from "@/components/profile/SecurityTab";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

const VALID_TABS = [
  "profile",
  "account",
  "security",
  "orders",
  "addresses",
  "billing",
  "notifications",
] as const;

const SEARCH_ITEMS = [
  { tab: "profile", keywords: ["name", "bio", "picture", "avatar", "personal", "info"], label: "Profile Information" },
  { tab: "account", keywords: ["phone", "email", "gender", "birthday", "contact"], label: "Account Details" },
  { tab: "security", keywords: ["password", "login", "sessions", "security", "delete", "remove"], label: "Security & Password" },
  { tab: "security", keywords: ["connected", "oauth", "google", "revoke", "disconnect"], label: "Connected Accounts" },
  { tab: "orders", keywords: ["orders", "purchases", "history", "buy"], label: "Order History" },
  { tab: "addresses", keywords: ["address", "shipping", "delivery", "location"], label: "Shipping Addresses" },
  { tab: "billing", keywords: ["payment", "card", "billing", "method"], label: "Payment Methods" },
  { tab: "notifications", keywords: ["notifications", "alerts", "email", "preferences"], label: "Notifications" },
  { tab: "notifications", keywords: ["appearance", "theme", "display", "dark", "light"], label: "Appearance & Theme" },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { fetching, userProfile } = useProfile();

  // Get tab from URL query parameter, default to "profile"
  const tabFromUrl = searchParams.get("tab");
  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number])
      ? tabFromUrl
      : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Check for missing profile information
  const missingInfo = useMemo(() => {
    const missing = [];
    if (!userProfile?.addresses || userProfile.addresses.length === 0) {
      missing.push({ label: "shipping address", tab: "addresses" });
    }
    if (!userProfile?.paymentMethods || userProfile.paymentMethods.length === 0) {
      missing.push({ label: "payment method", tab: "billing" });
    }
    if (!userProfile?.phone) {
      missing.push({ label: "phone number", tab: "account" });
    }
    if (!userProfile?.birthday) {
      missing.push({ label: "birthday", tab: "account" });
    }
    return missing;
  }, [userProfile]);

  // Search functionality
  const filteredSearchItems = useMemo(() => {
    return SEARCH_ITEMS;
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Update activeTab when URL changes (using useEffect for URL param changes)
  // This is necessary to sync state with URL params (e.g., browser back/forward)
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (
      currentTab &&
      VALID_TABS.includes(currentTab as (typeof VALID_TABS)[number]) &&
      currentTab !== activeTab
    ) {
      setActiveTab(currentTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when tab changes (without page reload)
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `/profile?tab=${value}`;
    router.replace(newUrl, { scroll: false });
  };

  // Redirect to login if unauthenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || fetching) {
    return <Loading />;
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const formatLastUpdated = () => {
    if (!userProfile?.updatedAt) return null;
    try {
      const date = new Date(userProfile.updatedAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return null;
    }
  };

  const lastUpdated = formatLastUpdated();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 font-normal"
              >
                <Search className="h-4 w-4" />
                Search settings
                <KbdGroup className="ml-2">
                  <Kbd>
                    Ctrl
                  </Kbd>
                  +
                  <Kbd>
                    K
                  </Kbd>
                </KbdGroup>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => router.push(`/edit-profile?tab=${activeTab}`)} size="icon" className="rounded-full">
                      <PencilLine className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Last Updated Badge */}
            {lastUpdated && (
              <Badge variant="secondary" className="text-xs justify-self-end">
                Last updated: {lastUpdated}
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            {missingInfo.length > 0 && !alertDismissed && (
              <Alert variant="secondary">
                <Info className="h-4 w-4 " />
                <AlertDescription className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">
                      Complete your profile
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="text-xs mb-2">You&apos;re missing the following information:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {missingInfo.map((item, index) => (
                          <li key={index}>
                            <button
                              onClick={() => router.push(`/edit-profile?tab=${item.tab}&action=add`)}
                              className="hover:underline capitalize inline cursor-pointer"
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setAlertDismissed(true)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="size-4" />
                  <span className="hidden lg:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="flex items-center gap-2"
                >
                  <Shield className="size-4" />
                  <span className="hidden lg:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Lock className="size-4" />
                  <span className="hidden lg:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="size-4" />
                  <span className="hidden lg:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-2"
                >
                  <MapPin className="size-4" />
                  <span className="hidden lg:inline">Addresses</span>
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="size-4" />
                  <span className="hidden lg:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell className="size-4" />
                  <span className="hidden lg:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-2">
                <ProfileDisplayTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="account" className="mt-2">
                <AccountDisplayTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="security" className="mt-2">
                <SecurityTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="orders" className="mt-2">
                <OrdersTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="addresses" className="mt-2">
                <AddressesTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="billing" className="mt-2">
                <BillingTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-2">
                <NotificationsTab userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search Command Dialog */}
        <Command>
          <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
            <CommandInput placeholder="Search settings..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Settings">
                {filteredSearchItems.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setActiveTab(item.tab);
                      handleTabChange(item.tab);
                      setSearchOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </Command>
      </motion.div>
    </div>
  );
}
