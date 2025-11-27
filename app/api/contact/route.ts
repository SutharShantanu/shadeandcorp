import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";

export const runtime = "nodejs"; // ensure Node runtime for crypto

const ContactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(200),
    topic: z.enum(["Support", "Order", "Returns", "Billing", "Partnerships", "Other"]).default("Support"),
    subject: z.string().min(3).max(150),
    message: z.string().min(10).max(2000),
    phone: z.string().max(20).optional().or(z.literal("")),
});

// Simple in-memory rate limiting and de-duplication
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const ipHits = new Map<string, number[]>();
const recentHashes = new Map<string, number>(); // payload hash -> timestamp

function getIp(req: NextRequest) {
    const xf = req.headers.get("x-forwarded-for");
    if (xf) return xf.split(",")[0].trim();
    return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string) {
    const now = Date.now();
    const hits = ipHits.get(ip) || [];
    const filtered = hits.filter((t) => now - t < WINDOW_MS);
    filtered.push(now);
    ipHits.set(ip, filtered);
    return filtered.length <= MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parse = ContactSchema.safeParse(body);
        if (!parse.success) {
            return NextResponse.json(
                { ok: false, error: "Invalid payload", issues: parse.error.flatten() },
                { status: 400 }
            );
        }

        const ip = getIp(req);
        if (!rateLimit(ip)) {
            return NextResponse.json(
                { ok: false, error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }

        // Deduplicate identical payloads in short window
        const hash = crypto
            .createHash("sha256")
            .update(JSON.stringify(parse.data))
            .digest("hex");

        const last = recentHashes.get(hash);
        const now = Date.now();
        if (last && now - last < 30_000) {
            return NextResponse.json(
                { ok: true, duplicate: true, message: "Duplicate ignored" },
                { status: 200 }
            );
        }
        recentHashes.set(hash, now);

        // Simulate processing (e.g., send email or enqueue)
        await new Promise((r) => setTimeout(r, 500));

        // In real app, persist to DB or send via email provider here

        return NextResponse.json({ ok: true, receivedAt: new Date().toISOString(), topic: parse.data.topic });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: "Server error" },
            { status: 500 }
        );
    }
}
