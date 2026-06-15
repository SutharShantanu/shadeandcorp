import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = newsletterSchema.parse(body);

    if (validatedData.honeypot) {
      // Silently ignore bots by returning a success response
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    const { email } = validatedData;

    // Determine if we should attempt to send real emails (only if configured)
    const isConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

    if (isConfigured) {
      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Email to the subscriber
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Newsletter" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to our Newsletter!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Thank you for subscribing!</h2>
            <p>We're excited to have you on board. You'll now be the first to know about our latest updates, deals, and exclusive offers.</p>
            <p>Best regards,<br>The Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.warn("Newsletter: SMTP credentials missing. Email was not sent. Received:", email);
      // We can mock success for dev/testing if no SMTP is configured
    }

    return NextResponse.json({ message: "Successfully subscribed to the newsletter." }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
