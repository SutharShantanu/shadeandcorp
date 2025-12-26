"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { BadgeInfo, BadgeAlert, Package, ShieldAlert } from "lucide-react";
import { getHighestPriorityNotification, getNotificationBadgeColor } from "@/lib/notificationUtils";

interface AvatarBadgeProps {
    className?: string;
}

export default function AvatarBadge({ className }: AvatarBadgeProps) {
    const { data: session } = useSession();

    const notifications = session?.user?.notifications ?? [];
    const highest = getHighestPriorityNotification(notifications);
    const hasIncomplete = !!session?.user?.hasProfileIncomplete;

    // Base classes applied directly to icon instead of wrapper
    const baseBadgeClasses = "absolute -bottom-1 -right-1 size-4";

    const renderHighest = () => {
        if (!highest) return null;
        const color = getNotificationBadgeColor(highest.type);
        const cls = `${baseBadgeClasses} ${color}`;
        switch (highest.type) {
            case "email_unverified":
                return <BadgeAlert className={cls} />;
            case "order_update":
                return <Package className={cls} />;
            case "security_alert":
                return <ShieldAlert className={cls} />;
            case "profile_incomplete":
            case "address_missing":
            case "payment_required":
            case "announcement":
            default:
                return <BadgeInfo className={cls} />;
        }
    };

    const renderIncomplete = () => {
        if (!hasIncomplete || highest) return null;
        const cls = `${baseBadgeClasses} ${getNotificationBadgeColor("profile_incomplete")}`;
        return <BadgeInfo className={cls} />;
    };

    return (
        <div className={`relative ${className ?? ""}`}>
            <Avatar className="h-8 w-8 transition-all ring ring-ring ring-offset-background">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User avatar"} />
                <AvatarFallback>{session?.user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            {renderHighest()}
            {renderIncomplete()}
        </div>
    );
}
