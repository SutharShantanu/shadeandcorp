import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";
import { generateToken, generateOTP } from "@/lib/authUtils";
import transporter from "@/lib/nodemailer";

// Helper function to send verification email with OTP and link
async function sendVerificationEmailWithOTP(
    email: string,
    firstName: string,
    otp: string,
    token: string
): Promise<void> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Verify Your Email Address',
        text: `Hi ${firstName},

Thank you for signing up! Please verify your email address to activate your account.

Your verification code is: ${otp}

Alternatively, you can click the link below to verify your email:
${verificationUrl}

This code and link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
Shade & Co Team`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .otp-code { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; padding: 20px; background-color: #f0fdf4; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: #10b981;">Shade & Co</h1>
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>

            <p><strong>Your verification code is:</strong></p>
            <div class="otp-code">${otp}</div>

            <p style="text-align: center;">— OR —</p>

            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>

            <p style="font-size: 14px; color: #6c757d;">This code and link will expire in 24 hours.</p>
            <p style="font-size: 14px; color: #6c757d;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Shade & Co Team</p>
            <p>&copy; ${new Date().getFullYear()} Shade & Co. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
}

// Helper function to send verification SMS via Firebase REST API
async function sendPhoneVerificationSMS(
    phone: string,
    recaptchaToken: string
): Promise<{ sessionInfo: string }> {
    const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
    if (!apiKey) {
        throw new Error("Firebase API Key is missing");
    }

    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phoneNumber: phone,
                recaptchaToken: recaptchaToken,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Firebase SMS Error:", data);
        throw new Error(data.error?.message || "Failed to send SMS via Firebase");
    }

    return { sessionInfo: data.sessionInfo };
}

// POST - Send verification (email or phone)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { type, recaptchaToken } = body; // 'email' or 'phone'

        await connectDB();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        // Handle email verification
        if (!type || type === 'email') {
            if (user.isEmailVerified) {
                return NextResponse.json(
                    { success: false, message: "Email is already verified." },
                    { status: 400 }
                );
            }

            // Generate both OTP and token
            const otp = generateOTP(); // 6-digit code
            const token = generateToken(); // Unique token for link
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Store both OTP and token
            user.emailVerificationToken = token;
            user.emailVerificationOTP = otp;
            user.emailVerificationExpires = expires;
            await user.save();

            // Send email with both OTP and link
            try {
                await sendVerificationEmailWithOTP(
                    user.email,
                    user.firstName || "User",
                    otp,
                    token
                );
            } catch (emailError) {
                console.error("Error sending verification email:", emailError);
                return NextResponse.json(
                    { success: false, message: "Failed to send verification email. Please try again." },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Verification email sent! Please check your inbox for the OTP code or verification link.",
            });
        }

        // Handle phone verification
        if (type === 'phone') {
            if (!user.phone) {
                return NextResponse.json(
                    { success: false, message: "No phone number found. Please add a phone number first." },
                    { status: 400 }
                );
            }

            if (user.isPhoneVerified) {
                return NextResponse.json(
                    { success: false, message: "Phone is already verified." },
                    { status: 400 }
                );
            }

            if (!recaptchaToken) {
                return NextResponse.json(
                    { success: false, message: "ReCAPTCHA token is required." },
                    { status: 400 }
                );
            }

            // Send SMS via Firebase
            try {
                const { sessionInfo } = await sendPhoneVerificationSMS(
                    user.phone,
                    recaptchaToken
                );

                return NextResponse.json({
                    success: true,
                    message: "Verification SMS sent! Please check your phone for the OTP code.",
                    sessionInfo
                });
            } catch (smsError: any) {
                console.error("Error sending verification SMS:", smsError);
                return NextResponse.json(
                    { success: false, message: smsError.message || "Failed to send verification SMS. Please try again." },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Invalid verification type. Use 'email' or 'phone'." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Send verification error:", error);
        return NextResponse.json(
            { success: false, message: "Server error. Please try again later." },
            { status: 500 }
        );
    }
}
