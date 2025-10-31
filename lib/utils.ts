import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Create a SHA-256 hash for a password.
 * NOTE: For production use a slow hashing algorithm like bcrypt or argon2.
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

/**
 * Compare a plain text password with its hashed version
 */
export async function comparePasswords(plain: string, hashed: string): Promise<boolean> {
  try {
    const plainHash = hashPassword(plain)
    return plainHash === hashed
  } catch (error) {
    console.error("Error comparing passwords:", error)
    return false
  }
}
