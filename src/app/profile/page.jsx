"use client";

import Loading from "@/components/loading";
import { useProfile } from "./hook/useProfile";
import Error from "../error";
import UserNotFound from "../userNotFound";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import AnimatedTabs from "@/components/ui/animated-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileTabEnum, tabs } from "./enums/profile.enums";
import { PencilLine, UserRoundPen } from "lucide-react";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NextLink } from "@/components/ui/link";

const UserTabs = ({ selectedTab, user }) => {
  const renderTabContent = () => {
    switch (selectedTab.value) {
      case ProfileTabEnum.OVERVIEW:
        return (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-28 h-28 shadow-md">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <p>{user?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case ProfileTabEnum.PERSONAL_INFO:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
              <div><strong>Gender:</strong> {user?.gender}</div>
              <div><strong>Birthday:</strong> {user?.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}</div>
            </CardContent>
          </Card>
        );

      case ProfileTabEnum.ADDRESSES:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.address?.map((addr, i) => (
                <div key={i} className="p-4 border rounded-lg shadow-sm bg-muted/20">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{addr.type}</span>
                    {addr.isDefault && <Badge>Default</Badge>}
                  </div>
                  <div>{addr.address1}, {addr.address2}</div>
                  <div>{addr.city}, {addr.state} - {addr.zipCode}</div>
                  <div>{addr.country} (+{addr.countryCode})</div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case ProfileTabEnum.PAYMENT_INFO:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.paymentMethods?.map((pm, i) => (
                <div key={i} className="p-4 border rounded shadow-sm bg-muted/20">
                  <div><strong>Card:</strong> **** **** **** {pm.cardNumber.slice(-4)}</div>
                  <div><strong>Name:</strong> {pm.cardHolderName}</div>
                  <div><strong>Expires:</strong> {pm.expiryDate}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case ProfileTabEnum.LOGIN_ACTIVITY:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.sessions?.map((session, i) => (
                <div key={i} className="p-4 border rounded shadow-sm bg-muted/20">
                  <div><strong>IP:</strong> {session.ipAddress}</div>
                  <div><strong>Location:</strong> {session.city}, {session.region}, {session.country}</div>
                  <div><strong>Timezone:</strong> {session.timezone}</div>
                  <div><strong>Logged In:</strong> {new Date(session.loggedInAt).toLocaleString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case ProfileTabEnum.ACCOUNT_SETTINGS:
        return (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              <div><strong>Role:</strong> {user?.role}</div>
              <div>
                <strong>Status:</strong>{' '}
                <Badge variant={user?.accountStatus === 'active' ? 'default' : 'destructive'}>
                  {user?.accountStatus}
                </Badge>
              </div>
              <div><strong>Joined:</strong> {new Date(user?.joinedDate).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderTabContent();
};

const ProfilePage = () => {
  const { user: authUser } = useAuthInfo();
  const userId = authUser?.id;
  const { user, error, isLoading } = useProfile(userId);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const index = tabs.findIndex(tab => tab.value === tabParam);

    if (index >= 0) {
      setSelectedTabIndex(index);
    } else {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('tab', tabs[0].value);
      router.push(`?${current.toString()}`, undefined, { scroll: false });
      setSelectedTabIndex(0);
    }
  }, [searchParams, router]);

  if (!authUser) return <UserNotFound />;
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const handleTabChange = (index) => {
    if (!tabs[index]) return;

    setSelectedTabIndex(index);
    const newTabValue = tabs[index].value;

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', newTabValue);
    router.replace(`?${current.toString()}`, { scroll: false });
  };

  return (
    <motion.div className="py-6 container mx-auto">
      <AnimatedTabs
        tabs={tabs}
        renderTabContent={(tab) => <UserTabs selectedTab={tab} user={user} />}
        selectedTabIndex={selectedTabIndex}
        setSelectedTab={handleTabChange}
        rightEndSection={
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <NextLink
                    href="/edit-profile"
                    variant="fadeSlide"
                    className="border border-border rounded-full p-1.5 group hover:bg-primary-default transition-all ease-in-out"
                  >
                    <PencilLine className="w-4 h-4 group-hover:text-primary-foreground" />
                  </NextLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Edit Profile</p>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        }
      />
    </motion.div>
  );
};

export default ProfilePage;