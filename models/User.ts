import mongoose, { Schema, Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export const GenderEnum = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  UNKNOWN: "",
} as const;

export const RoleEnum = {
  USER: "user",
  CUSTOMER: "customer",
  SELLER: "seller",
  ADMIN: "admin",
  SUPPORT: "support",
} as const;

export const AccountStatusEnum = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
} as const;

export const AddressTypeEnum = {
  HOME: "home",
  WORK: "work",
  OTHER: "other",
} as const;

// Interface for Address
export interface IAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

// Interface for Session
export interface ISession {
  ipAddress: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
  deviceInfo: string;
  loggedInAt: Date;
}

// Interface for Payment Method
export interface IPaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  isDefault: boolean;
}

// Main User Interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  countryCode: string;
  gender: string;
  birthday?: Date;
  profilePicture: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  phoneVerificationCode?: string;
  phoneVerificationExpires?: Date;
  role: string;
  accountStatus: string;
  addresses: IAddress[];
  paymentMethods: IPaymentMethod[];
  sessions: ISession[];
  joinDate: Date;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  countryCode: { type: String, default: "91" },
  gender: { type: String, enum: Object.values(GenderEnum), default: GenderEnum.UNKNOWN },
  birthday: { type: Date },
  profilePicture: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  phoneVerificationCode: { type: String },
  phoneVerificationExpires: { type: Date },
  role: { type: String, enum: Object.values(RoleEnum), default: RoleEnum.CUSTOMER },
  accountStatus: { type: String, enum: Object.values(AccountStatusEnum), default: AccountStatusEnum.ACTIVE },
  addresses: [{
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: "India" },
    addressType: { type: String, enum: Object.values(AddressTypeEnum), default: AddressTypeEnum.HOME },
    isDefault: { type: Boolean, default: false }
  }],
  paymentMethods: [{
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  sessions: [{
    ipAddress: { type: String, required: true },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    timezone: { type: String },
    org: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    deviceInfo: { type: String, required: true },
    loggedInAt: { type: Date, default: Date.now }
  }],
  joinDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as CallbackError);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;