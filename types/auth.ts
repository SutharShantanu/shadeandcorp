import { z } from "zod"
import type { DefaultSession } from "next-auth"

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Registration validation schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Inferred types from schemas
export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    error?: string;
}
// NextAuth type extensions
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string | null
      image?: string | null
      provider?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    image?: string | null
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    provider?: string
  }
}