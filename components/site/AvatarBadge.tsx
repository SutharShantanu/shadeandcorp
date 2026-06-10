"use client";

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge as UiAvatarBadge } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

interface AvatarBadgeProps {
    className?: string;
}

export default function AvatarBadge({ className }: AvatarBadgeProps) {
    const { data: session } = useSession();

    const notifications = session?.user?.notifications ?? [];
    const notificationCount = notifications.length;

    return (
        <Avatar className={`relative h-8 w-8 transition-all ring ring-ring ring-offset-background ${className ?? ""}`}>
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User avatar"} />
            <AvatarFallback>{session?.user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
            
            {/* Status / Verified Badge */}
            <UiAvatarBadge className="bg-blue-500 flex items-center justify-center p-0 border-none">
                <Check className="text-white w-2 h-2 stroke-[3px]" />
            </UiAvatarBadge>

            {/* Notification Count Badge */}
            {notificationCount > 0 && (
                <span className="border-background absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full border-2 bg-red-500 text-[9px] font-medium text-white">
                    {notificationCount}
                </span>
            )}
        </Avatar>
    );
}
