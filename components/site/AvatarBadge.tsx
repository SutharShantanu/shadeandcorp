"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge as UiAvatarBadge,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface AvatarBadgeProps {
  className?: string;
}

export default function AvatarBadge({ className }: AvatarBadgeProps) {
  const { data: session } = useSession();

  const notifications = session?.user?.notifications ?? [];
  const notificationCount = notifications.length;

  return (
    <Avatar
      className={cn("relative transition-all after:rounded-lg", className)}
    >
      <AvatarImage
        src={session?.user?.image || ""}
        alt={session?.user?.name || "User avatar"}
        className="rounded-lg"
      />
      <AvatarFallback
        data-slot="avatar-fallback"
        className="after:rounded-lg rounded-lg"
      >
        {session?.user?.name?.[0].toUpperCase() || "U"}
      </AvatarFallback>

      <UiAvatarBadge className="bg-primary flex items-center justify-center p-0 border-none">
        <Check className="text-primary-foreground stroke-[3px]" />
      </UiAvatarBadge>

      {notificationCount > 0 && (
        <Badge
          variant="warning"
          size="xs"
          className="border-background absolute -top-2 -right-2 flex items-center justify-center rounded-full"
        >
          {notificationCount}
        </Badge>
      )}
    </Avatar>
  );
}
