import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";
import NextAuth from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),

    // InstagramProvider({
    //   clientId: process.env.INSTAGRAM_CLIENT_ID,
    //   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    // }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required!");
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          if (!user) throw new Error("User not found");

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) throw new Error("Invalid credentials");

          const userObj = user.toObject();
          const { password, sessions, paymentMethods, address, ...safeUser } =
            userObj;
          return safeUser;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(
            error.message || "An unexpected error occurred during login"
          );
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        console.log("Sign in attempt", account);

        if (account.provider === "google" || account.provider === "instagram") {
          const existingUser = await User.findOne({ email: user.email }).lean();

          if (!existingUser) {
            const fullName = profile.name || "";
            const [firstName, ...lastNameParts] = fullName.split(" ");
            const lastName = lastNameParts.join(" ");

            const newUser = await User.create({
              firstName: profile.given_name || firstName || "User",
              lastName: profile.family_name || lastName || "",
              email: profile.email,
              phone: "",
              profilePicture: profile.picture || "",
              isVerified: true,
              role: "user",
              accountStatus: "active",
              password: `${account.provider}-oauth`,
            });

            const { password, sessions, paymentMethods, ...safeUser } =
              newUser.toObject();
            Object.assign(user, safeUser);
          } else {
            const { password, sessions, paymentMethods, ...safeUser } =
              existingUser;
            Object.assign(user, safeUser);
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id || null;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.profilePicture = user.profilePicture;
        token.accountStatus = user.accountStatus;

        if (user.address) {
          token.address = {
            address1: user.address.address1,
            address2: user.address.address2,
            city: user.address.city,
            state: user.address.state,
            zipCode: user.address.zipCode,
            country: user.address.country,
            countryCode: user.address.countryCode,
          };
        }

        if (user.sessions && Array.isArray(user.sessions)) {
          token.sessions = user.sessions.map((s) => ({
            device: s.device,
            location: s.location,
            ip: s.ip,
            lastActive: s.lastActive,
          }));
        }

        if (user.paymentMethods && Array.isArray(user.paymentMethods)) {
          token.paymentMethods = user.paymentMethods.map((p) => ({
            cardType: p.cardType,
            last4Digits: p.last4Digits,
            expiryDate: p.expiryDate,
            isDefault: p.isDefault,
          }));
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email,
          role: token.role,
          isVerified: token.isVerified,
          profilePicture: token.profilePicture,
          accountStatus: token.accountStatus,
          address: token.address || null,
          sessions: token.sessions || [],
          paymentMethods: token.paymentMethods || [],
        };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
