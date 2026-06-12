import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectDB from "@/lib/infrastructure/mongoDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import transporter from "@/lib/infrastructure/nodemailer";

// Helper function to send password change confirmation email
async function sendPasswordChangeEmail(email: string, firstName: string): Promise<void> {
    const timestamp = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your Password Has Been Changed',
        text: `Hi ${firstName},

Your password was successfully changed on ${timestamp}.

If you did not make this change, please contact our support team immediately or reset your password using the "Forgot Password" option.

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
        .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        .timestamp { font-weight: bold; color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: #10b981;">Shade & Co</h1>
        </div>
        <div class="content">
            <h2>Password Changed Successfully</h2>
            <p>Hi ${firstName},</p>
            <p>Your password was successfully changed on <span class="timestamp">${timestamp}</span>.</p>

            <div class="alert">
                <strong>⚠️ Security Notice</strong>
                <p style="margin: 10px 0 0 0;">If you did not make this change, please contact our support team immediately or reset your password using the "Forgot Password" option.</p>
            </div>

            <p>If you made this change, no further action is required.</p>
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

// POST - Change password
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await req.json();

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Current password and new password are required." },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, message: "New password must be at least 8 characters long." },
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

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Current password is incorrect." },
                { status: 400 }
            );
        }

        // Check if new password is same as current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            return NextResponse.json(
                { success: false, message: "New password must be different from your current password." },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        // Send confirmation email
        try {
            await sendPasswordChangeEmail(user.email, user.firstName || "User");
        } catch (emailError) {
            console.error("Error sending password change email:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            message: "Password changed successfully. A confirmation email has been sent.",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { success: false, message: "Server error. Please try again later." },
            { status: 500 }
        );
    }
}
