"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface ProfileDisplayTabProps {
  userProfile: UserProfile | null;
}

export default function ProfileDisplayTab({ userProfile }: ProfileDisplayTabProps) {
  const displayName = userProfile
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || userProfile.firstName || "User"
    : "User";

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          <AvatarImage
            src={userProfile?.profilePicture}
            alt={displayName}
          />
          <AvatarFallback className="text-lg">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>Your full name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">First Name</p>
                <p className="text-sm font-medium">
                  {userProfile?.firstName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Name</p>
                <p className="text-sm font-medium">
                  {userProfile?.lastName || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>Your verified email address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{userProfile?.email || "Not set"}</p>
            {userProfile?.isEmailVerified && (
              <span className="text-xs text-green-600 mt-1 inline-block">✓ Verified</span>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {userProfile?.bio || "No bio added yet."}
            </p>
          </CardContent>
        </Card>

        {userProfile?.urls && userProfile.urls.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>URLs</CardTitle>
              <CardDescription>Links to your website, blog, or social media profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userProfile.urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userProfile?.joinDate && (
          <Card>
            <CardHeader>
              <CardTitle>Member Since</CardTitle>
              <CardDescription>Your account creation date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {new Date(userProfile.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

