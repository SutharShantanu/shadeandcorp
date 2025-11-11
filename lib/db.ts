import User, { IUser } from '@/models/User';
import connectDB from '@/lib/mongoDB';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email }).lean();
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id).lean();
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  await connectDB();
  const user = new User(userData);
  return user.save();
}

export async function updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
  await connectDB();
  return User.findByIdAndUpdate(id, updateData, { new: true });
}

export async function setEmailVerificationToken(email: string, token: string): Promise<void> {
  await connectDB();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await User.findOneAndUpdate(
    { email },
    { 
      emailVerificationToken: token,
      emailVerificationExpires: expires
    }
  );
}

export async function verifyEmailToken(token: string): Promise<IUser | null> {
  await connectDB();
  return User.findOneAndUpdate(
    {
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    },
    {
      isEmailVerified: true,
      isVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined
    },
    { new: true }
  );
}

export async function setPasswordResetToken(email: string, token: string): Promise<void> {
  await connectDB();
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  await User.findOneAndUpdate(
    { email },
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    }
  );
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  await connectDB();
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) return false;

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return true;
}

export async function setPhoneVerificationCode(phone: string, code: string): Promise<void> {
  await connectDB();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await User.findOneAndUpdate(
    { phone },
    {
      phoneVerificationCode: code,
      phoneVerificationExpires: expires
    }
  );
}

export async function verifyPhoneCode(phone: string, code: string): Promise<boolean> {
  await connectDB();
  const result = await User.findOneAndUpdate(
    {
      phone,
      phoneVerificationCode: code,
      phoneVerificationExpires: { $gt: new Date() }
    },
    {
      phoneVerificationCode: undefined,
      phoneVerificationExpires: undefined
    }
  );
  return !!result;
}