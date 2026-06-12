import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/infrastructure/mongoDB";
import User from "@/models/User";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ provider: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { provider } = await params;

        if (!["google", "github"].includes(provider)) {
            return NextResponse.json(
                { error: "Invalid provider" },
                { status: 400 }
            );
        }

        await connectDB();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const cp = user.connectedProviders || {
            credentials: false,
            google: false,
            github: false,
        };

        // Count how many providers are currently connected
        const connectedCount = [cp.credentials, cp.google, cp.github].filter(
            Boolean
        ).length;

        if (connectedCount <= 1) {
            return NextResponse.json(
                {
                    error: "Cannot disconnect your only sign-in method. Please connect another account first.",
                },
                { status: 400 }
            );
        }

        // Revoke the provider
        user.connectedProviders = {
            ...cp,
            [provider]: false,
        };

        await user.save();

        return NextResponse.json({
            success: true,
            message: `${provider} account disconnected successfully`,
        });
    } catch (error) {
        console.error("Revoke provider error:", error);
        return NextResponse.json(
            { error: "Failed to disconnect provider" },
            { status: 500 }
        );
    }
}
