// Shared OTP store (use Redis in production)
interface OtpData {
  otp: string;
  expiresAt: number;
}

interface VerificationToken {
  verified: boolean;
  expiresAt: number;
}

const otpStore = new Map<string, OtpData>();
const verificationStore = new Map<string, VerificationToken>();

export const otpStoreService = {
  set(phone: string, otp: string, expiresInMs: number = 5 * 60 * 1000): void {
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + expiresInMs,
    });
  },

  get(phone: string): OtpData | undefined {
    return otpStore.get(phone);
  },

  delete(phone: string): boolean {
    return otpStore.delete(phone);
  },

  verify(phone: string, otp: string): boolean {
    const saved = otpStore.get(phone);
    if (!saved) return false;
    if (saved.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return false;
    }
    return saved.otp === otp;
  },

  // Store verification token after OTP is verified
  setVerificationToken(phone: string, expiresInMs: number = 5 * 60 * 1000): void {
    verificationStore.set(phone, {
      verified: true,
      expiresAt: Date.now() + expiresInMs,
    });
  },

  // Check if phone has a valid verification token
  isVerified(phone: string): boolean {
    const token = verificationStore.get(phone);
    if (!token) return false;
    if (token.expiresAt < Date.now()) {
      verificationStore.delete(phone);
      return false;
    }
    return token.verified;
  },

  // Delete verification token after use
  deleteVerificationToken(phone: string): boolean {
    return verificationStore.delete(phone);
  },
};
