import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { getDeviceInfo } from "@/lib/deviceUtils";
import connectDB from "@/lib/mongoDB";
import User, { IUser } from "@/models/User";
import { createUser, updateUser } from "@/lib/db";
import { otpStoreService } from "@/lib/otpStore";
import { generateUserNotifications } from "@/lib/notificationUtils";

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
      name: "Email/Phone & Password",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.emailOrPhone) {
            throw new Error("Email/Phone is required!");
          }

          await connectDB();

          // Check if input is email (contains @) or phone number
          const isEmail = credentials.emailOrPhone.includes('@');
          let user;

          if (isEmail) {
            // Email login requires password
            if (!credentials?.password) {
              throw new Error("Password is required for email login!");
            }
            user = await User.findOne({ email: credentials.emailOrPhone.toLowerCase().trim() });

            if (!user) throw new Error("User not found");
            if (user.accountStatus === "suspended") throw new Error("Account suspended");
            if (user.accountStatus === "deleted") throw new Error("Account not found");

            const isPasswordValid = await user.comparePassword(credentials.password);
            if (!isPasswordValid) throw new Error("Invalid credentials");
          } else {
            // Phone login uses OTP verification
            const phone = credentials.emailOrPhone.trim();
            user = await User.findOne({ phone });

            if (!user) throw new Error("User not found");
            if (user.accountStatus === "suspended") throw new Error("Account suspended");
            if (user.accountStatus === "deleted") throw new Error("Account not found");

            // Check if phone was verified
            if (!user.isPhoneVerified) {
              throw new Error("Phone verification required. Please verify your phone number first.");
            }
          }

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

          if (!user.connectedProviders) {
            user.connectedProviders = { google: false, github: false, credentials: true };
          } else if (!user.connectedProviders.credentials) {
            user.connectedProviders.credentials = true;
          }

          user.lastLogin = new Date();
          await user.save();

          return {
            id: String(user._id),
            email: user.email,
            name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.profilePicture,
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
      profile(profile) {
        // GitHub profile already contains the necessary data
        const nameParts = (profile.name || profile.login || '').split(' ');
        const firstName = nameParts[0] || profile.login || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          firstName,
          lastName,
        }
      }
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    verifyRequest: "/verify-email",
    newUser: "/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
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
            const firstName = typeof user.firstName === 'string'
              ? user.firstName
              : (typeof user.name === 'string' ? user.name.split(' ')[0] : 'User');
            const lastName = typeof user.lastName === 'string'
              ? user.lastName
              : (typeof user.name === 'string' ? user.name.split(' ').slice(1).join(' ') : '');

            const newUserData: Partial<IUser> = {
              firstName,
              lastName,
              email: user.email!,
              password: `${account.provider}-oauth-${Date.now()}`,
              profilePicture: user.image || '',
              isEmailVerified: true,
              isPhoneVerified: false,
              role: "customer", // Default role for OAuth users
              accountStatus: "active",
              connectedProviders: {
                google: account.provider === "google",
                github: account.provider === "github",
                credentials: false,
              },
            };

            await createUser(newUserData);
          } else {
            // Update existing user's last login
            // Ensure existingUser._id is a valid ObjectId/string
            const userId = typeof existingUser._id === 'string'
              ? existingUser._id
              : (existingUser._id && typeof existingUser._id.toString === 'function'
                ? existingUser._id.toString()
                : '');
            if (userId) {
              const connectedProviders = {
                credentials: existingUser.connectedProviders?.credentials ?? true,
                google: existingUser.connectedProviders?.google ?? false,
                github: existingUser.connectedProviders?.github ?? false,
              };

              if (account.provider === "google") {
                connectedProviders.google = true;
              }
              if (account.provider === "github") {
                connectedProviders.github = true;
              }

              await updateUser(userId, {
                lastLogin: new Date(),
                profilePicture: user.image || existingUser.profilePicture,
                connectedProviders
              });
            } else {
              throw new Error('Invalid user ID for update');
            }
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
        // Use type guard for extra fields that only exist on IUser
        if ('firstName' in user) token.firstName = user.firstName;
        if ('lastName' in user) token.lastName = user.lastName;
        if ('isEmailVerified' in user) token.isEmailVerified = user.isEmailVerified;
        if ('role' in user) token.role = user.role;
        const provider = account?.provider || token.provider || "credentials";
        token.provider = provider;

        const previousProviders = token.connectedProviders ?? {};
        token.connectedProviders = {
          credentials: previousProviders.credentials || provider === "credentials",
          google: previousProviders.google || provider === "google",
          github: previousProviders.github || provider === "github",
        };
      }

      // Refresh user data on session update
      if (trigger === "update") {
        await connectDB();
        const dbUser = await User.findById(token.id);
        if (dbUser) {
          token.name = `${dbUser.firstName} ${dbUser.lastName}`.trim();
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.image = dbUser.profilePicture;
          token.isEmailVerified = dbUser.isEmailVerified;
          token.isPhoneVerified = dbUser.isPhoneVerified;
          token.role = dbUser.role;
          token.connectedProviders = dbUser.connectedProviders ?? token.connectedProviders;
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

        // Fetch fresh user data from database to ensure we have latest values
        try {
          await connectDB();
          const dbUser = await User.findById(token.id);

          if (dbUser) {
            // Use fresh database values for critical fields
            session.user.isEmailVerified = dbUser.isEmailVerified;
            session.user.isPhoneVerified = dbUser.isPhoneVerified;
            session.user.firstName = dbUser.firstName;
            session.user.lastName = dbUser.lastName;
            session.user.role = dbUser.role;
            session.user.provider = token.provider as string;
            const dbConnected = dbUser.connectedProviders ?? {
              credentials: dbUser.password?.length > 0,
              google: false,
              github: false,
            };

            const providerIsCredentials = token.provider === "credentials";

            session.user.connectedProviders = {
              credentials: (dbConnected.credentials ?? (dbUser.password?.length ?? 0) > 0) || providerIsCredentials,
              google: dbConnected.google ?? false,
              github: dbConnected.github ?? false,
            };

            token.connectedProviders = session.user.connectedProviders;

            // Generate notifications based on fresh user data
            const notifications = generateUserNotifications({
              isEmailVerified: dbUser.isEmailVerified,
              isPhoneVerified: dbUser.isPhoneVerified,
              phone: dbUser.phone,
              addresses: dbUser.addresses || [],
              paymentMethods: dbUser.paymentMethods || [],
              birthday: dbUser.birthday ? String(dbUser.birthday) : undefined,
              gender: dbUser.gender,
            });

            session.user.notifications = notifications;

            // Set quick flags for common checks
            session.user.hasProfileIncomplete = !dbUser.birthday || !dbUser.gender || !dbUser.phone;
            session.user.hasMissingAddress = !dbUser.addresses || dbUser.addresses.length === 0;
            session.user.hasMissingPayment = !dbUser.paymentMethods || dbUser.paymentMethods.length === 0;
            session.user.hasMissingPhone = !dbUser.phone;
          } else {
            // Fallback to token values if DB fetch fails
            if ('firstName' in token) {
              session.user.firstName = token.firstName as string;
            }
            if ('lastName' in token) {
              session.user.lastName = token.lastName as string;
            }
            if ('isEmailVerified' in token) {
              session.user.isEmailVerified = token.isEmailVerified as boolean;
            }
            if ('isPhoneVerified' in token) {
              session.user.isPhoneVerified = token.isPhoneVerified as boolean;
            }
            if ('role' in token) {
              session.user.role = token.role as string;
            }
            session.user.provider = token.provider as string;
            const tokenConnected = token.connectedProviders as
              | {
                google?: boolean;
                github?: boolean;
                credentials?: boolean;
              }
              | undefined;

            const providerIsCredentials = token.provider === "credentials";

            session.user.connectedProviders = {
              credentials: (tokenConnected?.credentials ?? false) || providerIsCredentials || (!token.provider && true),
              google: tokenConnected?.google ?? token.provider === "google",
              github: tokenConnected?.github ?? token.provider === "github",
            };
          }
        } catch (error) {
          console.error("Error fetching fresh user data in session:", error);
          // Fallback to token values on error
          if ('firstName' in token) {
            session.user.firstName = token.firstName as string;
          }
          if ('lastName' in token) {
            session.user.lastName = token.lastName as string;
          }
          if ('isEmailVerified' in token) {
            session.user.isEmailVerified = token.isEmailVerified as boolean;
          }
          if ('isPhoneVerified' in token) {
            session.user.isPhoneVerified = token.isPhoneVerified as boolean;
          }
          if ('role' in token) {
            session.user.role = token.role as string;
          }
          session.user.provider = token.provider as string;
          const tokenConnected = token.connectedProviders as
            | {
              google?: boolean;
              github?: boolean;
              credentials?: boolean;
            }
            | undefined;

          const providerIsCredentials = token.provider === "credentials";

          session.user.connectedProviders = {
            credentials: (tokenConnected?.credentials ?? false) || providerIsCredentials || (!token.provider && true),
            google: tokenConnected?.google ?? token.provider === "google",
            github: tokenConnected?.github ?? token.provider === "github",
          };
        }
      }
      return session;
    },
  },
};

export default authOptions;