"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  Shield,
  CreditCard,
  Settings,
  Bell,
  Eye,
  Upload,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileTab from "@/components/profile/ProfileTab";
import AccountTab from "@/components/profile/AccountTab";
import BillingTab from "@/components/profile/BillingTab";
import AppearanceTab from "@/components/profile/AppearanceTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import DisplayTab from "@/components/profile/DisplayTab";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profileForm, accountForm, loading, fetching, userProfile, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [showErrors, setShowErrors] = useState(false);

  if (status === "loading" || fetching) {
    return <Loading />;
  }

  if (status === "unauthenticated" || !session) {
    router.push("/login");
    return null;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowErrors(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    const isValid = await profileForm.trigger();
    if (!isValid) return;

    const result = await updateProfile(profileForm.getValues(), "profile");
    if (result.success) {
      // Optionally show success message
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    const isValid = await accountForm.trigger();
    if (!isValid) return;

    const result = await updateProfile(accountForm.getValues(), "account");
    if (result.success) {
      // Optionally show success message
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Shield className="size-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Settings className="size-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="size-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="display" className="flex items-center gap-2">
                  <Eye className="size-4" />
                  <span className="hidden sm:inline">Display</span>
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

              <TabsContent value="billing" className="mt-6">
                <BillingTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="appearance" className="mt-6">
                <AppearanceTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <NotificationsTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="display" className="mt-6">
                <DisplayTab userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

