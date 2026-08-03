import {
  UserCircle,
  Shield,
  Lock,
  Package,
  MapPin,
  CreditCard,
  Bell,
} from "lucide-react";

export const VALID_TABS = [
  "profile",
  "account",
  "security",
  "orders",
  "addresses",
  "billing",
  "notifications",
] as const;

export type ProfileTabValue = (typeof VALID_TABS)[number];

export const PROFILE_TABS = [
  {
    heading: "Account Settings",
    items: [
      { value: "profile" as const, label: "Profile Info", icon: UserCircle },
      { value: "account" as const, label: "Account Details", icon: Shield },
      { value: "security" as const, label: "Security & Login", icon: Lock },
    ],
  },
  {
    heading: "Orders & Shopping",
    items: [
      { value: "orders" as const, label: "My Orders", icon: Package },
      { value: "addresses" as const, label: "Saved Addresses", icon: MapPin },
      { value: "billing" as const, label: "Payment Methods", icon: CreditCard },
    ],
  },
  {
    heading: "Preferences",
    items: [{ value: "notifications" as const, label: "Notifications", icon: Bell }],
  },
];
