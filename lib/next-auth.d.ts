import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      isVerified: boolean;
      isEmailVerified: boolean;
      role: string;
      provider: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    isEmailVerified?: boolean;
    role?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    isEmailVerified?: boolean;
    role?: string;
    provider?: string;
  }
}