import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { getDeviceInfo } from "@/lib/deviceUtils";
import connectDB from "@/lib/mongoDB";
import User, { IUser } from "@/models/User";
import { createUser, updateUser } from "@/lib/db";

interface GeoData {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  timezone?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required!");
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) throw new Error("User not found");
          if (user.accountStatus === "suspended") throw new Error("Account suspended");
          if (user.accountStatus === "deleted") throw new Error("Account not found");

          const isPasswordValid = await user.comparePassword(credentials.password);
          if (!isPasswordValid) throw new Error("Invalid credentials");

          // Track login session
          const ip = req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
                    req?.headers?.["x-real-ip"];

          let geoData: GeoData = {};
          try {
            if (ip) {
              const geoResponse = await fetch(`http://ipapi.co/${ip}/json/`);
              geoData = await geoResponse.json();
            }
          } catch (err) {
            console.warn("Geo API error:", err instanceof Error ? err.message : 'Unknown error');
          }

          const userAgent = req?.headers?.["user-agent"] || "";
          const deviceInfo = getDeviceInfo(userAgent);

          user.sessions.push({
            ipAddress: geoData.ip || ip || 'Unknown',
            city: geoData.city,
            region: geoData.region,
            country: geoData.country_name,
            timezone: geoData.timezone,
            org: geoData.org,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            deviceInfo: JSON.stringify(deviceInfo) || userAgent,
            loggedInAt: new Date(),
          });

          user.lastLogin = new Date();
          await user.save();

          const userObject = user.toObject();
          const { password, ...safeUser } = userObject;
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.profilePicture,
            isVerified: user.isVerified,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
          };

        } catch (error: unknown) {
          console.error("Authorization error:", error);
          throw new Error(error instanceof Error ? error.message : "An unexpected error occurred during login");
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
        }
      }
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      async profile(profile) {
        // Fetch full user data from GitHub
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${(profile as any).access_token}`,
          },
        });
        const githubUser = await response.json();

        const nameParts = (githubUser.name || profile.login).split(' ');
        const firstName = nameParts[0] || profile.login;
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: profile.id.toString(),
          name: githubUser.name || profile.login,
          email: profile.email,
          image: githubUser.avatar_url,
          firstName,
          lastName,
        }
      }
    }),
  ],

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
    newUser: "/auth/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        if (!user.email) {
          return false;
        }

        // Handle OAuth providers
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for OAuth
            const newUserData: Partial<IUser> = {
              firstName: (user as any).firstName || user.name?.split(' ')[0] || 'User',
              lastName: (user as any).lastName || user.name?.split(' ').slice(1).join(' ') || '',
              email: user.email!,
              password: `${account.provider}-oauth`,
              profilePicture: user.image || '',
              isVerified: true,
              isEmailVerified: true,
              role: "user",
              accountStatus: "active",
            };

            await createUser(newUserData);
          } else {
            // Update existing user's last login
            await updateUser(existingUser._id.toString(), { 
              lastLogin: new Date(),
              profilePicture: user.image || existingUser.profilePicture 
            });
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.isVerified = (user as any).isVerified;
        token.isEmailVerified = (user as any).isEmailVerified;
        token.role = (user as any).role;
        token.provider = account?.provider;
      }

      // Refresh user data on session update
      if (trigger === "update" && session) {
        await connectDB();
        const dbUser = await User.findById(token.id);
        if (dbUser) {
          token.name = `${dbUser.firstName} ${dbUser.lastName}`.trim();
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.image = dbUser.profilePicture;
          token.isVerified = dbUser.isVerified;
          token.isEmailVerified = dbUser.isEmailVerified;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
};

export default authOptions;