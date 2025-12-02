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

// POST - Verify email with OTP or token
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
        const { otp, token } = body;

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
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred during verification. Please try again." },
            { status: 500 }
        );
    }
}
