"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { BadgeAlert, BadgeCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import VerifyEmailModal from "@/components/modal/VerifyEmailModal";
import { useSearchParams } from "next/navigation";

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
            <p className="text-sm font-medium">
              {formatDate(userProfile?.birthday)}
            </p>
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
              {userProfile?.countryCode && userProfile?.phone
                ? `+${userProfile.countryCode} ${userProfile.phone}`
                : "Not set"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email Verification</p>
            <div className="flex items-center gap-2">
              {!userProfile?.isEmailVerified && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BadgeAlert className={`h-4 w-4 ${showOTPModal ? 'text-amber-500' : 'text-destructive'}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {showOTPModal
                        ? "Verification in progress. Please check your email for the OTP."
                        : "Your email is not verified."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              <p className="text-sm font-medium">{userProfile?.email}</p>
              {userProfile?.isEmailVerified ? (
                <Badge variant="default" className="bg-emerald-600">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </Badge>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || showOTPModal}
                  >
                    <Mail className="h-3 w-3" />
                    {isVerifyingEmail ? "Sending..." : showOTPModal ? "Check Email" : "Verify"}
                  </Button>
                </>
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
              {userProfile?.countryCode && userProfile?.phone ? (
                <>
                  <p className="text-sm font-medium">
                    +{userProfile.countryCode} {userProfile.phone}
                  </p>
                  {userProfile?.isPhoneVerified ? (
                    <Badge variant="default" className="bg-emerald-600">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </>
              ) : (
                <Badge variant="outline" className="text-amber-600">
                  <BadgeAlert className="h-4 w-4" />
                  Add phone first
                </Badge>
              )}
            </div>
          </div>
          {userProfile?.accountStatus && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-muted-foreground">Current account state</p>
              <Badge
                variant={userProfile.accountStatus === "active" ? "default" : "destructive"}
                className={userProfile.accountStatus === "active" ? "bg-emerald-600" : ""}
              >
                {userProfile.accountStatus === "active" && (
                  <BadgeCheck className="w-3 h-3" />
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

