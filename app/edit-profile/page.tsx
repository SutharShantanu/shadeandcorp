"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Shield,
  CreditCard,
  Bell,
  ArrowLeft,
  Package,
  MapPin,
  Lock,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileTab from "@/components/profile/ProfileTab";
import AccountTab from "@/components/profile/AccountTab";
import BillingTab from "@/components/profile/BillingTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import SecurityTab from "@/components/profile/SecurityTab";
import OrdersTab from "@/components/profile/OrdersTab";
import AddressesTab from "@/components/profile/AddressesTab";

const VALID_TABS = [
  "profile",
  "account",
  "security",
  "orders",
  "addresses",
  "billing",
  "notifications",
] as const;

function EditProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const {
    profileForm,
    accountForm,
    loading,
    fetching,
    userProfile,
    updateProfile,
  } = useProfile();

  // Get tab and action from URL query parameters
  const tabFromUrl = searchParams.get("tab");
  const actionFromUrl = searchParams.get("action");
  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number])
      ? tabFromUrl
      : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showErrors, setShowErrors] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(
    actionFromUrl === "add",
  );

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
    setShowErrors(false);
    const newUrl = `/edit-profile?tab=${value}`;
    router.replace(newUrl, { scroll: false });
  };

  if (status === "loading" || fetching) {
    return <Loading />;
  }

  if (status === "unauthenticated" || !session) {
    router.push("/login");
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const isValid = await profileForm.trigger();
    if (!isValid) return;

    const result = await updateProfile(profileForm.getValues(), "profile");
    if (result.success) {
      // Redirect to profile page with the same tab
      router.push(`/profile?tab=${activeTab}`);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const isValid = await accountForm.trigger();
    if (!isValid) return;

    const result = await updateProfile(accountForm.getValues(), "account");
    if (result.success) {
      // Redirect to profile page with the same tab
      router.push(`/profile?tab=${activeTab}`);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your account settings and preferences.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/profile?tab=${activeTab}`)}
          >
            <ArrowLeft className="size-4" />
            Back to Profile
          </Button>
        </div>

        <Card className="p-0">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
              layout="vertical"
            >
              <TabsList className="relative z-10">
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

              <TabsContent value="profile" >
                <ProfileTab
                  form={profileForm}
                  loading={loading}
                  showErrors={showErrors}
                  onSubmit={handleProfileSubmit}
                  userProfile={userProfile}
                />
              </TabsContent>

              <TabsContent value="account" >
                <AccountTab
                  form={accountForm}
                  loading={loading}
                  showErrors={showErrors}
                  onSubmit={handleAccountSubmit}
                  userProfile={userProfile}
                />
              </TabsContent>

              <TabsContent value="security" >
                <SecurityTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="orders" >
                <OrdersTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="addresses" >
                <AddressesTab
                  userProfile={userProfile}
                  shouldOpenModal={shouldOpenModal}
                  onModalClose={() => setShouldOpenModal(false)}
                />
              </TabsContent>

              <TabsContent value="billing" >
                <BillingTab
                  userProfile={userProfile}
                  shouldOpenModal={shouldOpenModal}
                  onModalClose={() => setShouldOpenModal(false)}
                />
              </TabsContent>

              <TabsContent value="notifications" >
                <NotificationsTab userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditProfileContent />
    </Suspense>
  );
}
