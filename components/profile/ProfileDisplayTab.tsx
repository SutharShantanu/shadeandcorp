"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { BadgeAlert, BadgeCheck, CalendarClock, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconBadge } from "../ui/icon-badge";
import { format } from "date-fns";

interface ProfileDisplayTabProps {
  userProfile: UserProfile | null;
}

export default function ProfileDisplayTab({ userProfile }: ProfileDisplayTabProps) {
  const displayName = userProfile
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || userProfile.firstName || "User"
    : "User";

  return (
    <div className="space-y-8">
      {/* Profile Picture & Basic Info */}
      <div className="flex items-center gap-4">
        <Avatar className="size-24 border">
          <AvatarImage
            src={userProfile?.profilePicture}
            alt={displayName}
          />
          <AvatarFallback className="text-xl">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">{userProfile?.email}
            {userProfile?.isEmailVerified ? (
              <BadgeCheck className="h-4 w-4 fill-accent-foreground text-primary-foreground" />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BadgeAlert className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your email is not verified.</p>
                </TooltipContent>
              </Tooltip>
            )}
          </p>
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Personal Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">First Name</p>
            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                <User className="h-4 w-4 text-muted-foreground" />
              </IconBadge>
              <p className="text-sm font-medium">{userProfile?.firstName || "Not set"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Last Name</p>
            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                <User className="h-4 w-4 text-muted-foreground" />
              </IconBadge>
              <p className="text-sm font-medium">{userProfile?.lastName || "Optional"}</p>
            </div>
          </div>
        </div>
      </div>

      {userProfile?.joinDate && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Member Since</p>
            <div className="flex items-center gap-2 mt-1">
              <IconBadge>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </IconBadge>
              <p className="text-sm font-medium">
                {format(new Date(userProfile.joinDate), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

