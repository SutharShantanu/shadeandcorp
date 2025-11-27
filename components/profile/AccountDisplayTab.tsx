"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-8">
      {/* Contact Information */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Contact Information</h4>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Phone Number</p>
          <p className="text-sm font-medium">
            {userProfile?.countryCode && userProfile?.phone
              ? `+${userProfile.countryCode} ${userProfile.phone}`
              : "Not set"}
          </p>
        </div>
      </div>

      <Separator />

      {/* Personal Details */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Personal Details</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gender</p>
            <p className="text-sm font-medium capitalize">
              {userProfile?.gender || "Not set"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Birthday</p>
            <p className="text-sm font-medium">
              {formatDate(userProfile?.birthday)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Status */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Account Verification</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email Verification</p>
              <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
            </div>
            {userProfile?.isEmailVerified ? (
              <Badge variant="default" className="bg-emerald-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary">Unverified</Badge>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone Verification</p>
              <p className="text-xs text-muted-foreground">
                {userProfile?.countryCode && userProfile?.phone
                  ? `+${userProfile.countryCode} ${userProfile.phone}`
                  : "No phone number"}
              </p>
            </div>
            {userProfile?.isPhoneVerified ? (
              <Badge variant="default" className="bg-emerald-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary">Unverified</Badge>
            )}
          </div>

          {userProfile?.role && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Role</p>
                <p className="text-xs text-muted-foreground">Your access level</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {userProfile.role}
              </Badge>
            </div>
          )}

          {userProfile?.accountStatus && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Status</p>
                <p className="text-xs text-muted-foreground">Current account state</p>
              </div>
              <Badge
                variant={userProfile.accountStatus === "active" ? "default" : "destructive"}
                className={userProfile.accountStatus === "active" ? "bg-emerald-600" : ""}
              >
                {userProfile.accountStatus === "active" && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="capitalize">{userProfile.accountStatus}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Activity */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Activity</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {userProfile?.joinDate && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium">
                {formatDate(userProfile.joinDate)}
              </p>
            </div>
          )}
          {userProfile?.lastLogin && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Login</p>
              <p className="text-sm font-medium">
                {formatDate(userProfile.lastLogin)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

