import type { UserNotification } from "./next-auth.d";

interface UserData {
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    phone?: string;
    addresses?: unknown[];
    paymentMethods?: unknown[];
    birthday?: string;
    gender?: string;
    pendingOrders?: number;
    dispatchedOrders?: number;
    deliveredOrders?: number;
}

/**
 * Generate user notifications based on their profile and activity
 */
export function generateUserNotifications(userData: UserData): UserNotification[] {
    const notifications: UserNotification[] = [];

    // Email verification
    if (!userData.isEmailVerified) {
        notifications.push({
            type: "email_unverified",
            message: "Verify your email address",
            category: "profile",
            priority: "high",
            actionUrl: "/profile?tab=account",
        });
    }

    // Phone verification (only when phone exists but unverified)
    if (!userData.isPhoneVerified && userData.phone) {
        notifications.push({
            type: "phone_unverified",
            message: "Verify your phone number",
            category: "profile",
            priority: "medium",
            actionUrl: "/profile?tab=account",
        });
    }

    // Aggregate profile incompleteness into a single notification
    const missingItems: string[] = [];
    if (!userData.phone) missingItems.push("phone number");
    if (!userData.birthday) missingItems.push("birthday");
    if (!userData.gender) missingItems.push("gender");

    if (missingItems.length > 0) {
        // Determine priority: medium if phone missing, else low
        const priority: UserNotification["priority"] = missingItems.includes("phone number") ? "medium" : "low";
        const labelList = missingItems.join(", ");
        notifications.push({
            type: "profile_incomplete",
            message: `Complete your profile: missing ${labelList}`,
            category: "profile",
            priority,
            actionUrl: "/edit-profile?tab=account",
        });
    }

    // Missing address
    if (!userData.addresses || userData.addresses.length === 0) {
        notifications.push({
            type: "address_missing",
            message: "Add a shipping address",
            category: "settings",
            priority: "medium",
            actionUrl: "/profile?tab=addresses",
        });
    }

    // Missing payment method
    if (!userData.paymentMethods || userData.paymentMethods.length === 0) {
        notifications.push({
            type: "payment_required",
            message: "Add a payment method",
            category: "settings",
            priority: "medium",
            actionUrl: "/profile?tab=billing",
        });
    }

    // Order updates
    if (userData.pendingOrders && userData.pendingOrders > 0) {
        notifications.push({
            type: "order_update",
            message: `${userData.pendingOrders} order${userData.pendingOrders > 1 ? 's' : ''} pending`,
            category: "orders",
            priority: "medium",
            actionUrl: "/profile?tab=orders",
            count: userData.pendingOrders,
        });
    }

    if (userData.dispatchedOrders && userData.dispatchedOrders > 0) {
        notifications.push({
            type: "order_update",
            message: `${userData.dispatchedOrders} order${userData.dispatchedOrders > 1 ? 's' : ''} dispatched`,
            category: "orders",
            priority: "high",
            actionUrl: "/profile?tab=orders",
            count: userData.dispatchedOrders,
        });
    }

    if (userData.deliveredOrders && userData.deliveredOrders > 0) {
        notifications.push({
            type: "order_update",
            message: `${userData.deliveredOrders} order${userData.deliveredOrders > 1 ? 's' : ''} delivered`,
            category: "orders",
            priority: "medium",
            actionUrl: "/profile?tab=orders",
            count: userData.deliveredOrders,
        });
    }

    return notifications;
}

/**
 * Get the highest priority notification for badge display
 */
export function getHighestPriorityNotification(
    notifications: UserNotification[]
): UserNotification | null {
    if (!notifications || notifications.length === 0) return null;

    const priorityOrder = { high: 3, medium: 2, low: 1 };

    return notifications.reduce((highest, current) => {
        const currentPriority = priorityOrder[current.priority];
        const highestPriority = priorityOrder[highest.priority];
        return currentPriority > highestPriority ? current : highest;
    });
}

/**
 * Get notification badge color based on type
 */
export function getNotificationBadgeColor(type: UserNotification["type"]): string {
    const colorMap: Record<UserNotification["type"], string> = {
        profile_incomplete: "rounded-full fill-blue-500 text-white",
        email_unverified: "rounded-full fill-amber-500 text-white",
        phone_unverified: "rounded-full fill-amber-500 text-white",
        order_update: "rounded-full fill-emerald-500 text-white",
        payment_required: "rounded-full fill-blue-500 text-white",
        address_missing: "rounded-full fill-blue-500 text-white",
        announcement: "rounded-full fill-purple-500 text-white",
        security_alert: "rounded-full fill-red-500 text-white",
    };

    return colorMap[type] || "rounded-full fill-gray-500 text-white";
}

/**
 * Get notification icon name based on type
 */
export function getNotificationIcon(type: UserNotification["type"]): string {
    const iconMap: Record<UserNotification["type"], string> = {
        profile_incomplete: "BadgeInfo",
        email_unverified: "BadgeAlert",
        phone_unverified: "BadgeAlert",
        order_update: "Package",
        payment_required: "CreditCard",
        address_missing: "MapPin",
        announcement: "Bell",
        security_alert: "ShieldAlert",
    };

    return iconMap[type] || "Bell";
}

/**
 * Get notifications by category for menu items
 */
export function getNotificationsByCategory(
    notifications: UserNotification[],
    category: UserNotification["category"]
): UserNotification[] {
    return notifications.filter((n) => n.category === category);
}

/**
 * Check if user has critical notifications
 */
export function hasCriticalNotifications(notifications: UserNotification[]): boolean {
    return notifications.some((n) => n.priority === "high");
}
