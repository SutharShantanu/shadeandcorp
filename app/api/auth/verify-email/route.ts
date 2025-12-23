import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/mongoDB";
import User from "@/models/User";
import transporter from "@/lib/nodemailer";

// Helper function to send email verification confirmation
async function sendVerificationConfirmationEmail(
    email: string,
    firstName: string
): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Email Verified Successfully! 🎉',
        text: `Hi ${firstName},

Congratulations! Your email address has been successfully verified.

Your account is now fully activated and you can enjoy all the features of Shade & Co.

Thank you for being a part of our community!

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
        .success-icon { text-align: center; margin: 20px 0; }
        .success-badge { display: inline-block; padding: 15px 30px; background-color: #10b981; color: white; border-radius: 50px; font-size: 18px; font-weight: bold; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: #10b981;">Shade & Co</h1>
        </div>
        <div class="content">
            <div class="success-icon">
                <div class="success-badge">✓ Email Verified</div>
            </div>

            <h2 style="text-align: center; color: #10b981;">Congratulations!</h2>
            <p>Hi ${firstName},</p>
            <p>Your email address has been <strong>successfully verified</strong>.</p>

            <p>Your account is now fully activated and you can enjoy all the features of Shade & Co:</p>
            <ul style="line-height: 2;">
                <li>Browse our exclusive collections</li>
                <li>Save items to your wishlist</li>
                <li>Faster checkout process</li>
                <li>Track your orders</li>
                <li>Receive personalized recommendations</li>
            </ul>

            <p>Thank you for being a part of our community!</p>
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

// Helper function to verify phone number via Firebase REST API
async function verifyPhoneWithFirebase(
    sessionInfo: string,
    code: string
): Promise<{ phoneNumber: string }> {
    const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
    if (!apiKey) {
        throw new Error("Firebase API Key is missing");
    }

    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionInfo,
                code,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Firebase Verify Error:", data);
        throw new Error(data.error?.message || "Failed to verify phone via Firebase");
    }

    return { phoneNumber: data.phoneNumber };
}

// Helper function to send phone verification confirmation SMS
async function sendPhoneVerificationConfirmationSMS(
    phone: string,
    firstName: string
): Promise<void> {
    // This is optional if Firebase already sends a confirmation, but we'll keep the log for now.
    console.log(`
========================================
SMS Confirmation
========================================
To: ${phone}
Message: Hi ${firstName}, your phone number has been successfully verified! Thank you for being a part of Shade & Co.
========================================
    `);
}

// POST - Verify email or phone with OTP or token
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
        const { otp, token, type, sessionInfo } = body; // type: 'email' or 'phone'

        // Must provide either OTP or token
        if (!otp && !token) {
            return NextResponse.json(
                { success: false, message: "OTP or verification token is required." },
                { status: 400 }
            );
        }

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

            // Check if verification has expired
            if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
                return NextResponse.json(
                    { success: false, message: "Verification code has expired. Please request a new one." },
                    { status: 400 }
                );
            }

            // Verify using OTP or token
            let isValid = false;

            if (otp && user.emailVerificationOTP) {
                // Verify OTP (case-insensitive comparison)
                isValid = otp.trim().toLowerCase() === user.emailVerificationOTP.toLowerCase();
            } else if (token && user.emailVerificationToken) {
                // Verify token
                isValid = token === user.emailVerificationToken;
            }

            if (!isValid) {
                return NextResponse.json(
                    { success: false, message: "Invalid verification code. Please try again." },
                    { status: 400 }
                );
            }

            // Mark email as verified and clear verification fields
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationOTP = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            // Send confirmation email
            try {
                await sendVerificationConfirmationEmail(
                    user.email,
                    user.firstName || "User"
                );
            } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
                // Don't fail the verification if email fails to send
            }

            return NextResponse.json({
                success: true,
                message: "Email verified successfully!",
            });
        }

        // Handle phone verification
        if (type === 'phone') {
            if (user.isPhoneVerified) {
                return NextResponse.json(
                    { success: false, message: "Phone is already verified." },
                    { status: 400 }
                );
            }

            if (!otp && !token) {
                return NextResponse.json(
                    { success: false, message: "Verification code is required." },
                    { status: 400 }
                );
            }

            // Verify with Firebase if sessionInfo is provided
            if (sessionInfo && otp) {
                try {
                    await verifyPhoneWithFirebase(sessionInfo, otp);
                } catch (verifyError: any) {
                    console.error("Firebase Verification Error:", verifyError);
                    return NextResponse.json(
                        { success: false, message: verifyError.message || "Invalid or expired verification code." },
                        { status: 400 }
                    );
                }
            } else {
                // FALLBACK: Traditional logic if no sessionInfo (for existing codes or other flows)
                // Check if verification has expired
                if (user.phoneVerificationExpires && new Date() > user.phoneVerificationExpires) {
                    return NextResponse.json(
                        { success: false, message: "Verification code has expired. Please request a new one." },
                        { status: 400 }
                    );
                }

                // Verify using OTP or token
                let isValid = false;

                if (otp && user.phoneVerificationOTP) {
                    isValid = otp.trim().toLowerCase() === user.phoneVerificationOTP.toLowerCase();
                } else if (token && user.phoneVerificationCode) {
                    isValid = token === user.phoneVerificationCode;
                }

                if (!isValid) {
                    return NextResponse.json(
                        { success: false, message: "Invalid verification code. Please try again." },
                        { status: 400 }
                    );
                }
            }

            // Mark phone as verified and clear verification fields
            user.isPhoneVerified = true;
            user.phoneVerificationCode = undefined;
            user.phoneVerificationOTP = undefined;
            user.phoneVerificationExpires = undefined;
            await user.save();

            // Send confirmation SMS
            try {
                if (user.phone) {
                    await sendPhoneVerificationConfirmationSMS(
                        user.phone,
                        user.firstName || "User"
                    );
                }
            } catch (smsError) {
                console.error("Error sending confirmation SMS:", smsError);
            }

            return NextResponse.json({
                success: true,
                message: "Phone verified successfully!",
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid verification type. Use 'email' or 'phone'." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred during verification. Please try again." },
            { status: 500 }
        );
    }
}
