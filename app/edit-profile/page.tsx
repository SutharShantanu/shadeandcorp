"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Shield,
  CreditCard,
  Settings,
  Bell,
  ArrowLeft,
  Link2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileTab from "@/components/profile/ProfileTab";
import AccountTab from "@/components/profile/AccountTab";
import BillingTab from "@/components/profile/BillingTab";
import AppearanceTab from "@/components/profile/AppearanceTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import ConnectedAccountsTab from "@/components/profile/ConnectedAccountsTab";

const VALID_TABS = [
  "profile",
  "account",
  "connected",
  "billing",
  "appearance",
  "notifications",
] as const;

export default function EditProfilePage() {
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

  // Get tab from URL query parameter, default to "profile"
  const tabFromUrl = searchParams.get("tab");
  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number])
      ? tabFromUrl
      : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showErrors, setShowErrors] = useState(false);

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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
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
          <Link href={`/profile?tab=${activeTab}`}>
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
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
                  value="connected"
                  className="flex items-center gap-2"
                >
                  <Link2 className="size-4" />
                  <span className="hidden lg:inline">Connected</span>
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="size-4" />
                  <span className="hidden lg:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2"
                >
                  <Settings className="size-4" />
                  <span className="hidden lg:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell className="size-4" />
                  <span className="hidden lg:inline">Notifications</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <ProfileTab
                  form={profileForm}
                  loading={loading}
                  showErrors={showErrors}
                  onSubmit={handleProfileSubmit}
                  userProfile={userProfile}
                />
              </TabsContent>

              <TabsContent value="account" className="mt-6">
                <AccountTab
                  form={accountForm}
                  loading={loading}
                  showErrors={showErrors}
                  onSubmit={handleAccountSubmit}
                  userProfile={userProfile}
                />
              </TabsContent>

              <TabsContent value="connected" className="mt-6">
                <ConnectedAccountsTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="billing" className="mt-6">
                <BillingTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="appearance" className="mt-6">
                <AppearanceTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <NotificationsTab userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
