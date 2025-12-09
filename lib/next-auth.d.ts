import "next-auth";
import "next-auth/jwt";

export type NotificationType =
  | "profile_incomplete"
  | "email_unverified"
  | "phone_unverified"
  | "order_update"
  | "payment_required"
  | "address_missing"
  | "announcement"
  | "security_alert";

export interface UserNotification {
  type: NotificationType;
  message: string;
  category: "profile" | "orders" | "security" | "settings" | "general";
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  count?: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
      isEmailVerified?: boolean;
      isPhoneVerified?: boolean;
      role?: string;
      provider?: string;
      connectedProviders?: {
        google?: boolean;
        github?: boolean;
        credentials?: boolean;
      };
      notifications?: UserNotification[];
      hasProfileIncomplete?: boolean;
      hasMissingAddress?: boolean;
      hasMissingPayment?: boolean;
      hasMissingPhone?: boolean;
    };
  }

  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    role?: string;
    provider?: string;
    connectedProviders?: {
      google?: boolean;
      github?: boolean;
      credentials?: boolean;
    };
    notifications?: UserNotification[];
    hasProfileIncomplete?: boolean;
    hasMissingAddress?: boolean;
    hasMissingPayment?: boolean;
    hasMissingPhone?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    role?: string;
    provider?: string;
    connectedProviders?: {
      google?: boolean;
      github?: boolean;
      credentials?: boolean;
    };
    notifications?: UserNotification[];
    hasProfileIncomplete?: boolean;
    hasMissingAddress?: boolean;
    hasMissingPayment?: boolean;
    hasMissingPhone?: boolean;
  }
}