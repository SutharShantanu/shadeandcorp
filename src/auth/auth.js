import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required!");
        }

        console.log(
          "email",
          credentials.email,
          "password",
          credentials.password
        );

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).lean();

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid credentials");

        const { password, sessions, paymentMethods, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      console.log("this is signin attempt");
      if (account.provider === "google" || account.provider === "instagram") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const nameParts = profile.name?.split(" ") || [];

          const newUser = await User.create({
            firstName: profile.given_name || nameParts[0] || "User",
            lastName: profile.family_name || nameParts.slice(1).join(" ") || "",
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
            existingUser.toObject();
          Object.assign(user, safeUser);
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        Object.assign(token, user);
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = { ...token };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
    // error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
