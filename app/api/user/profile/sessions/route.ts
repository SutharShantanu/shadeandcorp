import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/infrastructure/mongoDB";
import User from "@/models/User";

// DELETE - Remove a session or all other sessions
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const sessionIndex = searchParams.get("index");

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.sessions || user.sessions.length === 0) {
      return NextResponse.json({ ok: true, message: "No sessions found" });
    }

    if (action === "all_others") {
      // Keep only the last session (assuming it's the current one based on SecurityTab logic)
      if (user.sessions.length > 0) {
        user.sessions = [user.sessions[user.sessions.length - 1]];
        await user.save();
      }
      return NextResponse.json({
        ok: true,
        message: "All other sessions logged out successfully",
        sessions: user.sessions,
      });
    } else if (sessionIndex !== null) {
      const idx = parseInt(sessionIndex, 10);
      if (isNaN(idx) || idx < 0 || idx >= user.sessions.length) {
        return NextResponse.json(
          { ok: false, error: "Invalid session index" },
          { status: 400 }
        );
      }
      
      // Remove specific session
      user.sessions.splice(idx, 1);
      await user.save();
      
      return NextResponse.json({
        ok: true,
        message: "Session logged out successfully",
        sessions: user.sessions,
      });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
