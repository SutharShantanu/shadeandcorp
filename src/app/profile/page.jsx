"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/loading";
import { useProfile } from "./hook/useProfile";
import Error from "../error";
import UserNotFound from "../userNotFound";
import { useAuthInfo } from "@/hook/useAuthInfo";

const ProfilePage = () => {
  const { user: authUser } = useAuthInfo();

  const userId = authUser?.id;
  const { user, error, isLoading } = useProfile(userId);

  if (!authUser) return <UserNotFound />;

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <ScrollArea className="p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-center">{user?.firstName} {user?.lastName}</CardTitle>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-sm">{user?.phone}</p>
        </CardHeader>
      </Card>

      {/* Basic Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
            <div key={index} className="p-2 border rounded-lg">
              <div className="flex justify-between">
                <span><strong>{addr.type}</strong></span>
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
            <div key={index} className="p-2 border rounded">
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
            <div key={index} className="p-2 border rounded">
              <div><strong>IP:</strong> {session.ipAddress}</div>
              <div><strong>Location:</strong> {session.city}, {session.region}, {session.country}</div>
              <div><strong>Timezone:</strong> {session.timezone}</div>
              <div><strong>Logged In:</strong> {new Date(session.loggedInAt).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Role:</strong> {user?.role}</div>
          <div><strong>Status:</strong> <Badge variant={user?.accountStatus === "active" ? "default" : "destructive"}>{user?.accountStatus}</Badge></div>
          <div><strong>Joined:</strong> {new Date(user?.joinedDate).toLocaleDateString()}</div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}

export default ProfilePage;