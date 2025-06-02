"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useProfile } from "./hook/useProfile";
import Error from "../error";
import UserNotFound from "../userNotFound";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { AnimatedTabs } from "@/components/ui/animatedTabs/animated-tabs";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user: authUser } = useAuthInfo();
  const userId = authUser?.id;
  const { user, error, isLoading } = useProfile(userId);

  if (!authUser) return <UserNotFound />;
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const tabs = [
    { label: "Profile Overview", value: "overview" },
    { label: "Personal Information", value: "personal-info" },
    { label: "Saved Addresses", value: "addresses" },
    { label: "Payment Information", value: "payment-info" },
    { label: "Login Activity", value: "login-activity" },
    { label: "Account Settings", value: "account-settings" }
  ];

  return (
    <motion.div className="py-6 container mx-auto">

      <AnimatedTabs tabs={tabs} />
      <ScrollArea >
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <Avatar className="w-28 h-28 shadow-md">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
              </Avatar>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p>{user?.phone}</p>
                  </div>

                  {/* Edit Button */}
                  <Button variant="outline" className="mt-4 md:mt-0">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
            <div><strong>Gender:</strong> {user?.gender}</div>
            <div><strong>Birthday:</strong> {user?.birthday ? new Date(user.birthday).toLocaleDateString() : "N/A"}</div>
          </CardContent>
        </Card>

        {/* Address List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.address?.map((addr, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm bg-muted/20">
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

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Saved Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.paymentMethods?.map((pm, index) => (
              <div key={index} className="p-4 border rounded shadow-sm bg-muted/20">
                <div><strong>Card:</strong> **** **** **** {pm.cardNumber.slice(-4)}</div>
                <div><strong>Name:</strong> {pm.cardHolderName}</div>
                <div><strong>Expires:</strong> {pm.expiryDate}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Session History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.sessions?.map((session, index) => (
              <div key={index} className="p-4 border rounded shadow-sm bg-muted/20">
                <div><strong>IP:</strong> {session.ipAddress}</div>
                <div><strong>Location:</strong> {session.city}, {session.region}, {session.country}</div>
                <div><strong>Timezone:</strong> {session.timezone}</div>
                <div><strong>Logged In:</strong> {new Date(session.loggedInAt).toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
            <div><strong>Role:</strong> {user?.role}</div>
            <div>
              <strong>Status:</strong>{" "}
              <Badge variant={user?.accountStatus === "active" ? "default" : "destructive"}>
                {user?.accountStatus}
              </Badge>
            </div>
            <div><strong>Joined:</strong> {new Date(user?.joinedDate).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </ScrollArea>
    </motion.div>
  );
};

export default ProfilePage;