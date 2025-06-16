import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/Users";
import connectDB from "@/lib/mongoDB";
import NextAuth from "next-auth";
import axios from "axios";
import { getDeviceInfo } from "@/lib/deviceUtils";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        // Uncomment if needed
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
            async authorize(credentials, req) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required!");
                    }

                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) throw new Error("User not found");

                    const isPasswordValid = bcrypt.compareSync(
                        credentials.password,
                        user.password
                    );
                    if (!isPasswordValid) throw new Error("Invalid credentials");

                    let ip =
                        req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
                        req?.headers?.["x-real-ip"];

                    let geoData = {};
                    try {
                        const geoResponse = await axios.get(`http://ipapi.co/${ip}/json/`);
                        geoData = geoResponse.data;
                    } catch (err) {
                        console.warn("Geo API error:", err.message);
                    }

                    const userAgent = req?.headers?.["user-agent"] || "";
                    const deviceInfo = getDeviceInfo(userAgent);

                    user.sessions.push({
                        ipAddress: geoData.ip || ip,
                        city: geoData.city,
                        region: geoData.region,
                        country: geoData.country_name,
                        timezone: geoData.timezone,
                        org: geoData.org,
                        latitude: geoData.latitude,
                        longitude: geoData.longitude,
                        deviceInfo: deviceInfo || userAgent,
                        loggedInAt: new Date(),
                    });

                    await user.save();

                    const { password, ...safeUser } = user.toObject();
                    safeUser.id = user._id.toString();
                    return safeUser;

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

                if (
                    account?.provider === "google" ||
                    account?.provider === "instagram"
                ) {
                    const existingUser = await User.findOne({ email: user.email }).lean();

                    if (!existingUser) {
                        const fullName = profile.name || "";
                        const [firstName, ...lastNameParts] = fullName.split(" ");
                        const lastName = lastNameParts.join(" ");

                        const newUser = await User.create({
                            firstName: profile.given_name || firstName || "User",
                            lastName: profile.family_name || lastName || "",
                            gender: profile.gender || "",
                            birthday: profile.birthday || "",
                            email: profile.email,
                            phone: "",
                            countryCode: profile.countryCode,
                            address: [],
                            profilePicture: profile.picture || "",
                            password: `${account.provider}-oauth`,
                            isVerified: true,
                            role: "user",
                            accountStatus: "active",
                            sessions: [],
                        });

                        const { password, ...safeUser } = newUser.toObject();
                        Object.assign(user, safeUser);
                    } else {
                        const { password, ...safeUser } = existingUser;
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
                token.id = (user._id || user.id || "").toString();
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.gender = user.gender;
                token.birthday = user.birthday;
                token.email = user.email;
                token.phone = user.phone;
                token.countryCode = user.countryCode;
                token.role = user.role;
                token.isVerified = user.isVerified;
                token.profilePicture = user.profilePicture;
                token.accountStatus = user.accountStatus;
                token.joinDate = user.joinDate;

                if (Array.isArray(user.address)) {
                    token.address = user.address.map((addr) => ({
                        address1: addr.address1,
                        address2: addr.address2,
                        city: addr.city,
                        state: addr.state,
                        zipCode: addr.zipCode,
                        country: addr.country,
                    }));
                }

                if (Array.isArray(user.paymentMethods)) {
                    token.paymentMethods = user.paymentMethods.map((p) => ({
                        cardNumber: p.cardNumber,
                        expiryDate: p.expiryDate,
                        cardHolderName: p.cardHolderName,
                    }));
                }

                if (Array.isArray(user.sessions)) {
                    token.sessions = user.sessions.map((s) => ({
                        ipAddress: s.ipAddress,
                        city: s.city,
                        region: s.region,
                        country: s.country,
                        timezone: s.timezone,
                        org: s.org,
                        latitude: s.latitude,
                        longitude: s.longitude,
                        deviceInfo: s.deviceInfo,
                        loggedInAt: s.loggedInAt,
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
                    gender: token.gender,
                    birthday: token.birthday,
                    email: token.email,
                    phone: token.phone,
                    countryCode: token.countryCode,
                    address: token.address || [],
                    profilePicture: token.profilePicture,
                    isVerified: token.isVerified,
                    role: token.role,
                    accountStatus: token.accountStatus,
                    sessions: token.sessions || [],
                    paymentMethods: token.paymentMethods || [],
                    joinDate: token.joinDate,
                };
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        // maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/login",
        error: "/auth/error",
    },

    secret: process.env.NEXTAUTH_SECRET,
});