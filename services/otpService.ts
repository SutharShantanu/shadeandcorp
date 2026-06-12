import { adminAuth } from "@/lib/infrastructure/firebaseAdmin";

interface UserData {
  firstName?: string;
  lastName?: string;
}

export const otpService = {
  async createOrGetUserByPhone(phone: string, userData: UserData = {}) {
    try {
      // 🚀 Try getting existing user
      const existing = await adminAuth.getUserByPhoneNumber(phone);
      return { user: existing, isNew: false };
    } catch (error) {
      // Create new user
      const fullName = [userData.firstName, userData.lastName]
        .filter(Boolean)
        .join(" ");

      const newUser = await adminAuth.createUser({
        phoneNumber: phone,
        displayName: fullName || undefined,
      });

      return { user: newUser, isNew: true };
    }
  },

  async verifyIdToken(idToken: string) {
    return adminAuth.verifyIdToken(idToken); // returns firebase user info
  },
};
