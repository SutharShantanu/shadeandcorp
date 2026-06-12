import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    MONGODB_URI_PREFIX: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.substring(0, 30) + "..."
      : "NOT SET",
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_ID: !!process.env.GITHUB_ID,
    GITHUB_SECRET: !!process.env.GITHUB_SECRET,
  };

  let dbStatus = "NOT TESTED";
  let dbError = null;

  if (process.env.MONGODB_URI) {
    try {
      const { default: connectDB } = await import("@/lib/infrastructure/mongoDB");
      const conn = await connectDB();
      dbStatus = conn.connection.readyState === 1 ? "CONNECTED" : `STATE: ${conn.connection.readyState}`;
    } catch (err: any) {
      dbStatus = "FAILED";
      dbError = err.message;
    }
  } else {
    dbStatus = "SKIPPED - No MONGODB_URI";
  }

  return NextResponse.json({
    envCheck,
    dbStatus,
    dbError,
    timestamp: new Date().toISOString(),
  });
}
