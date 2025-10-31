import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { type NextAuthOptions } from "next-auth"
import { loginSchema } from "@/types/auth"
import { comparePasswords } from "@/lib/utils"
import { getUserByEmail } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          // Validate input format
          const result = loginSchema.safeParse(credentials)
          if (!result.success) {
            throw new Error("Invalid credentials format")
          }
          
          const { email, password } = result.data
          const user = await getUserByEmail(email)
          
          if (!user) {
            throw new Error("Invalid credentials")
          }
          
          const isValidPassword = await comparePasswords(password, user.passwordHash)
          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
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
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user id and provider to the session
        session.user.id = token.sub as string
        session.user.provider = token.provider as string
        // Remove sensitive info
        delete (token as any).provider
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        // On first sign in
        token.provider = account?.provider
        token.sub = user.id
      }
      return token
    }
  },
}

export default authOptions
