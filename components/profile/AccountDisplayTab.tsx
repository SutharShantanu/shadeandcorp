"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface AccountDisplayTabProps {
  userProfile: UserProfile | null;
}

export default function AccountDisplayTab({ userProfile }: AccountDisplayTabProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phone Number</CardTitle>
            <CardDescription>Your phone number for account verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Country Code</p>
                <p className="text-sm font-medium">
                  {userProfile?.countryCode ? `+${userProfile.countryCode}` : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">
                  {userProfile?.phone || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender</CardTitle>
            <CardDescription>Your gender preference</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium capitalize">
              {userProfile?.gender || "Not set"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Birthday</CardTitle>
            <CardDescription>Your date of birth</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {formatDate(userProfile?.birthday)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm">
                Verified:{" "}
                <span className={userProfile?.isVerified ? "text-green-600" : "text-muted-foreground"}>
                  {userProfile?.isVerified ? "✓ Yes" : "✗ No"}
                </span>
              </p>
              <p className="text-sm">
                Email Verified:{" "}
                <span className={userProfile?.isEmailVerified ? "text-green-600" : "text-muted-foreground"}>
                  {userProfile?.isEmailVerified ? "✓ Yes" : "✗ No"}
                </span>
              </p>
              {userProfile?.accountStatus && (
                <p className="text-sm">
                  Status:{" "}
                  <span className="capitalize">{userProfile.accountStatus}</span>
                </p>
              )}
              {userProfile?.role && (
                <p className="text-sm">
                  Role:{" "}
                  <span className="capitalize">{userProfile.role}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {userProfile?.joinDate && (
          <Card>
            <CardHeader>
              <CardTitle>Member Since</CardTitle>
              <CardDescription>Your account creation date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {formatDate(userProfile.joinDate)}
              </p>
            </CardContent>
          </Card>
        )}

        {userProfile?.lastLogin && (
          <Card>
            <CardHeader>
              <CardTitle>Last Login</CardTitle>
              <CardDescription>Your last login timestamp</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {formatDate(userProfile.lastLogin)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

