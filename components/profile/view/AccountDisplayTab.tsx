"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import {
  ArrowUpRight,
  BadgeAlert,
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  History,
  Mail,
  Mars,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Transgender,
  Trash2,
  Venus,
} from "lucide-react";
import VerifyEmailModal from "@/components/modal/VerifyEmailModal";
import VerifyPhoneModal from "@/components/modal/VerifyPhoneModal";
import Link from "next/link";
import { IconBadge } from "@/components/ui/icon-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { useAccountDisplayTab } from "../hooks/useAccountDisplayTab";

interface AccountDisplayTabProps {
  userProfile: UserProfile | null;
}

export default function AccountDisplayTab({
  userProfile,
}: AccountDisplayTabProps) {
  const {
    isVerifyingEmail,
    showOTPModal,
    setShowOTPModal,
    isVerifyingPhone,
    showPhoneOTPModal,
    setShowPhoneOTPModal,
    phoneSessionInfo,
    setPhoneSessionInfo,
    handleVerifyEmail,
    handleVerifyPhone,
  } = useAccountDisplayTab(userProfile);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* OTP Verification Modals */}
      <VerifyEmailModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={userProfile?.email || ""}
      />

      <VerifyPhoneModal
        open={showPhoneOTPModal}
        onOpenChange={setShowPhoneOTPModal}
        phone={
          userProfile?.phone
            ? userProfile.phone.startsWith("+")
              ? userProfile.phone
              : `+${userProfile.countryCode} ${userProfile.phone}`
            : ""
        }
        sessionInfo={phoneSessionInfo}
        onSessionInfoUpdate={setPhoneSessionInfo}
      />

      {/* Personal Details */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Personal Details</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Gender</p>
            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                {userProfile?.gender === "male" ? (
                  <Mars className="h-4 w-4 text-muted-foreground" />
                ) : userProfile?.gender === "female" ? (
                  <Venus className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Transgender className="h-4 w-4 text-muted-foreground" />
                )}
              </IconBadge>

              <p className="text-sm font-medium capitalize">
                {userProfile?.gender || <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Birthday</p>
            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </IconBadge>

              {userProfile?.birthday ? (
                <span className="text-sm font-medium">
                  {format(new Date(userProfile.birthday), "MMM do, yyyy")}
                </span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Contact Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Phone Number</p>

            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </IconBadge>

              <p className="text-sm font-medium">
                {userProfile?.phone
                  ? userProfile.phone.startsWith("+")
                    ? userProfile.phone
                    : `+${userProfile.countryCode} ${userProfile.phone}`
                  : <span className="text-muted-foreground">N/A</span>}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email Verification</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mt-1">
                <IconBadge>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </IconBadge>
                <p className="text-sm font-medium">{userProfile?.email}</p>
                {userProfile?.isEmailVerified ? (
                  <Badge variant="secondary" color="success" className="h-6">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" color="warning">
                    <BadgeAlert className="h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </div>

              {!userProfile?.isEmailVerified && (
                <Alert color="warning" className="py-2.5">
                  <BadgeAlert />
                  <AlertDescription className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Email not verified</p>
                      <p className="text-tiny opacity-90">
                        Verify to secure your account.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleVerifyEmail}
                      disabled={isVerifyingEmail || showOTPModal}
                      className="h-7 text-xs shrink-0"
                    >
                      {isVerifyingEmail
                        ? "Sending..."
                        : showOTPModal
                          ? "Enter OTP"
                          : "Verify Now"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Status */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Account Verification</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Phone Verification</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mt-1">
                <IconBadge>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </IconBadge>
                {userProfile?.phone ? (
                  <>
                    <p className="text-sm font-medium">
                      {userProfile.phone.startsWith("+")
                        ? userProfile.phone
                        : `+${userProfile.countryCode} ${userProfile.phone}`}
                    </p>
                    {userProfile?.isPhoneVerified ? (
                      <Badge
                        variant="secondary"
                        color="success"
                        className="h-6"
                      >
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" color="warning">
                        <BadgeAlert className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" color="warning" className="h-6">
                    Add phone number first
                  </Badge>
                )}
              </div>

              {userProfile?.phone && !userProfile?.isPhoneVerified && (
                <Alert color="warning" className="py-2.5">
                  <BadgeAlert />
                  <AlertDescription className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium">Phone not verified</p>
                      <p className="text-tiny opacity-90">
                        Verify to secure your account.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleVerifyPhone}
                      disabled={isVerifyingPhone || showPhoneOTPModal}
                      className="h-7 text-xs shrink-0"
                    >
                      {isVerifyingPhone
                        ? "Sending..."
                        : showPhoneOTPModal
                          ? "Enter OTP"
                          : "Verify Now"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          {userProfile?.accountStatus && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <IconBadge>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </IconBadge>
                <Badge
                  variant={
                    userProfile.accountStatus === "active"
                      ? "secondary"
                      : userProfile.accountStatus === "suspended"
                        ? "default"
                        : "destructive"
                  }
                  color={
                    userProfile.accountStatus === "active"
                      ? "success"
                      : userProfile.accountStatus === "suspended"
                        ? "warning"
                        : undefined
                  }
                >
                  {userProfile.accountStatus === "active" && (
                    <BadgeCheck className="w-3 h-3" />
                  )}
                  {userProfile.accountStatus === "suspended" && (
                    <ShieldAlert className="w-3 h-3" />
                  )}
                  {userProfile.accountStatus === "deleted" && (
                    <Trash2 className="w-3 h-3" />
                  )}
                  <span className="capitalize">
                    {userProfile.accountStatus}
                  </span>
                </Badge>
              </div>
            </div>
          )}

          {/* {userProfile?.role && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Role</p>
                <p className="text-xs text-muted-foreground">Your access level</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {userProfile.role}
              </Badge>
            </div>
          )} */}
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
              <div className="flex items-center gap-2 mt-1">
                <IconBadge>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </IconBadge>
                <p className="text-sm font-medium">
                  {formatDate(userProfile.joinDate)}
                </p>
              </div>
            </div>
          )}
          {userProfile?.lastLogin && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Login</p>
              <div className="flex items-center gap-2 mt-1">
                <IconBadge>
                  <History className="h-4 w-4 text-muted-foreground" />
                </IconBadge>
                <Link
                  href="/profile?tab=security"
                  className="group flex items-center gap-1 text-sm font-medium capitalize hover:underline underline-offset-2 hover:text-foreground transition-all"
                >
                  {formatDate(userProfile.lastLogin)}
                  <ArrowUpRight
                    className="opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                    strokeWidth={1}
                    size={14}
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
