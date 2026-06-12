import { randomBytes } from 'crypto';
import { setEmailVerificationToken, setPasswordResetToken, setPhoneVerificationCode } from './infrastructure/db';

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
  
  // TODO: Implement your email service (Nodemailer, SendGrid, etc.)
  console.log(`Verification email sent to ${email}: ${verificationUrl}`);
  
  await setEmailVerificationToken(email, token);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  // TODO: Implement your email service
  console.log(`Password reset email sent to ${email}: ${resetUrl}`);
  
  await setPasswordResetToken(email, token);
}

export async function sendPhoneVerificationCode(phone: string, code: string): Promise<void> {
  // TODO: Implement your SMS service (Twilio, etc.)
  console.log(`Verification code sent to ${phone}: ${code}`);
  
  await setPhoneVerificationCode(phone, code);
}