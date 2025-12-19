"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { BadgeAlert, BadgeCheck, Mail, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import VerifyEmailModal from "@/components/modal/VerifyEmailModal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface AccountDisplayTabProps {
  userProfile: UserProfile | null;
}

export default function AccountDisplayTab({ userProfile }: AccountDisplayTabProps) {
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const searchParams = useSearchParams();

  // Check URL parameter on mount to restore modal state
  useEffect(() => {
    const isVerifying = searchParams.get('verifying-email') === 'true';
    if (isVerifying && !userProfile?.isEmailVerified) {
      setShowOTPModal(true);
    }
  }, [searchParams, userProfile?.isEmailVerified]);

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to send verification email", { id: toastId });
        return;
      }

      toast.success("Verification email sent! Check your inbox.", { id: toastId });
      // Open the OTP modal after successfully sending the email
      setShowOTPModal(true);
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

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
      {/* OTP Verification Modal */}
      <VerifyEmailModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={userProfile?.email || ""}
      />

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
            <div className="flex items-center gap-2 mt-1">
              <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-md p-2 w-16 h-16 border border-primary/20">
                <span className="text-xs font-bold uppercase">
                  {userProfile?.birthday ? new Date(userProfile.birthday).toLocaleString('default', { month: 'short' }) : '--'}
                </span>
                <span className="text-2xl font-bold">
                  {userProfile?.birthday ? new Date(userProfile.birthday).getDate() : '--'}
                </span>
              </div>
              {userProfile?.birthday && <span className="text-sm text-muted-foreground">{new Date(userProfile.birthday).getFullYear()}</span>}
              {!userProfile?.birthday && <span className="text-sm text-muted-foreground">Not set</span>}
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
            <p className="text-sm font-medium">
              {userProfile?.phone
                ? userProfile.phone.startsWith('+')
                  ? userProfile.phone
                  : `+${userProfile.countryCode} ${userProfile.phone}`
                : "Not set"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email Verification</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{userProfile?.email}</p>
                {userProfile?.isEmailVerified ? (
                  <Badge variant="secondary" color="success" className="h-6">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-500 border-amber-500/50 bg-amber-500/10 h-6">
                    Pending
                  </Badge>
                )}
              </div>

              {!userProfile?.isEmailVerified && (
                <div className="flex items-center p-3 rounded-md bg-muted/50 border border-amber-500/20">
                  <BadgeAlert className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
                  <div className="flex-1 mr-2">
                    <p className="text-xs font-medium">Email not verified</p>
                    <p className="text-[10px] text-muted-foreground">Verify to secure your account.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || showOTPModal}
                    className="h-7 text-xs"
                  >
                    {isVerifyingEmail ? "Sending..." : showOTPModal ? "Enter OTP" : "Verify Now"}
                  </Button>
                </div>
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
            <div className="flex items-center gap-2">
              {userProfile?.phone ? (
                <>
                  <p className="text-sm font-medium">
                    {userProfile.phone.startsWith('+')
                      ? userProfile.phone
                      : `+${userProfile.countryCode} ${userProfile.phone}`
                    }
                  </p>
                  {userProfile?.isPhoneVerified ? (
                    <Badge variant="secondary" color="success">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </>
              ) : (
                <Badge variant="secondary" color="warning">
                  <BadgeAlert className="h-4 w-4" />
                  Add phone number first
                </Badge>
              )}
            </div>
          </div>
          {userProfile?.accountStatus && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Status</p>
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
                <span className="capitalize">{userProfile.accountStatus}</span>
              </Badge>
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
              <p className="text-sm font-medium">
                {formatDate(userProfile.joinDate)}
              </p>
            </div>
          )}
          {userProfile?.lastLogin && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Login</p>
              <Link
                href="/profile?tab=security"
                className="text-sm font-medium hover:underline text-primary flex items-center gap-1 group"
              >
                {formatDate(userProfile.lastLogin)}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

