"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  UserCircle,
  Shield,
  CreditCard,
  Bell,
  ChevronLeft,
  Package,
  MapPin,
  Lock,
} from "lucide-react";

import { Frame, FrameHeader, FramePanel } from "@/components/ui/frame";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExpandableButton } from "@/components/extended/button";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileTab from "@/components/profile/edit/ProfileTab";
import AccountTab from "@/components/profile/edit/AccountTab";
import BillingTab from "@/components/profile/edit/BillingTab";
import NotificationsTab from "@/components/profile/edit/NotificationsTab";
import SecurityTab from "@/components/profile/edit/SecurityTab";
import OrdersTab from "@/components/profile/view/OrdersTab";
import AddressesTab from "@/components/profile/edit/AddressesTab";

import {
  VALID_TABS,
  PROFILE_TABS,
} from "@/components/profile/shared/profile-tabs";

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
    deleteSession,
    deleteAllOtherSessions,
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
        <Frame>
          <FrameHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
                  Update your account settings and preferences.
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ExpandableButton
                  variant="outline"
                  onClick={() => router.push(`/profile?tab=${activeTab}`)}
                  text="Back to Profile"
                  icon={ChevronLeft}
                />
              </div>
            </div>
          </FrameHeader>
          <FramePanel>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              orientation="vertical"
              className="flex flex-col md:flex-row w-full border rounded-xl overflow-hidden"
            >
              <div className="w-full md:w-64 ">
                <div className="sticky top-0 h-full">
                  <TabsList className="flex flex-col p-4 justify-normal h-full! w-full gap-1 items-start">
                    {PROFILE_TABS.map((group, index) => (
                      <div key={group.heading} className="w-full">
                        <div
                          className={cn(
                            "px-3 py-1.5 text-tiny font-bold text-muted-foreground uppercase tracking-wider mb-1",
                            index > 0 && "mt-2",
                          )}
                        >
                          {group.heading}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <TabsTrigger key={item.value} value={item.value}>
                                <Icon className="size-4 shrink-0" />
                                <span className="flex-1 text-left">
                                  {item.label}
                                </span>
                              </TabsTrigger>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 p-4 md:p-6">
                <TabsContent value="profile">
                  <ProfileTab
                    form={profileForm}
                    loading={loading}
                    showErrors={showErrors}
                    onSubmit={handleProfileSubmit}
                    userProfile={userProfile}
                  />
                </TabsContent>

                <TabsContent value="account">
                  <AccountTab
                    form={accountForm}
                    loading={loading}
                    showErrors={showErrors}
                    onSubmit={handleAccountSubmit}
                    userProfile={userProfile}
                  />
                </TabsContent>

                <TabsContent value="security">
                  <SecurityTab
                    userProfile={userProfile}
                    onLogoutSession={deleteSession}
                    onLogoutAllSessions={deleteAllOtherSessions}
                  />
                </TabsContent>

                <TabsContent value="orders">
                  <OrdersTab userProfile={userProfile} />
                </TabsContent>

                <TabsContent value="addresses">
                  <AddressesTab
                    userProfile={userProfile}
                    shouldOpenModal={shouldOpenModal}
                    onModalClose={() => setShouldOpenModal(false)}
                  />
                </TabsContent>

                <TabsContent value="billing">
                  <BillingTab
                    userProfile={userProfile}
                    shouldOpenModal={shouldOpenModal}
                    onModalClose={() => setShouldOpenModal(false)}
                  />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationsTab userProfile={userProfile} />
                </TabsContent>
              </div>
            </Tabs>
          </FramePanel>
        </Frame>
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
