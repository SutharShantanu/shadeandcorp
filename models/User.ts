import mongoose, { Schema, Document, Model } from 'mongoose';
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
  type: "credit-card" | "debit-card" | "upi" | "net-banking";
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardHolderName: string;
  upiId?: string;
  accountNumber?: string;
  bankName?: string;
  isDefault: boolean;
}

// Main User Interface
export interface IConnectedProviders {
  google?: boolean;
  github?: boolean;
  credentials?: boolean;
}

export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  countryCode: string;
  gender: string;
  birthday?: Date;
  profilePicture: string;
  bio?: string;
  urls?: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationOTP?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  phoneVerificationCode?: string;
  phoneVerificationOTP?: string;
  phoneVerificationExpires?: Date;
  role: string;
  accountStatus: string;
  addresses: IAddress[];
  paymentMethods: IPaymentMethod[];
  sessions: ISession[];
  connectedProviders?: IConnectedProviders;
  joinDate: Date;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: false, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  countryCode: { type: String, default: "91" },
  gender: { type: String, enum: Object.values(GenderEnum), default: GenderEnum.UNKNOWN },
  birthday: { type: Date },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  urls: [{ type: String }],
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationOTP: { type: String },
  emailVerificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  phoneVerificationCode: { type: String },
  phoneVerificationOTP: { type: String },
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
    type: { type: String, enum: ["credit-card", "debit-card", "upi", "net-banking"], required: true },
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvc: { type: String },
    cardHolderName: { type: String, required: true },
    upiId: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
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
  connectedProviders: {
    google: { type: Boolean, default: false },
    github: { type: Boolean, default: false },
    credentials: { type: Boolean, default: false }
  },
  joinDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Custom validator for payment methods
UserSchema.pre<IUser>('save', function () {
  if (this.isModified('paymentMethods')) {
    const errors: Record<string, string> = {};

    this.paymentMethods.forEach((method: IPaymentMethod, index: number) => {
      if (method.type === 'credit-card' || method.type === 'debit-card') {
        if (!method.cardNumber) {
          errors[`paymentMethods.${index}.cardNumber`] = 'Card number is required for card payments';
        }
        if (!method.expiryDate) {
          errors[`paymentMethods.${index}.expiryDate`] = 'Expiry date is required for card payments';
        }
        if (!method.cvc) {
          errors[`paymentMethods.${index}.cvc`] = 'CVC is required for card payments';
        }
      } else if (method.type === 'upi') {
        if (!method.upiId) {
          errors[`paymentMethods.${index}.upiId`] = 'UPI ID is required for UPI payments';
        }
      } else if (method.type === 'net-banking') {
        if (!method.accountNumber) {
          errors[`paymentMethods.${index}.accountNumber`] = 'Account number is required for net-banking';
        }
        if (!method.bankName) {
          errors[`paymentMethods.${index}.bankName`] = 'Bank name is required for net-banking';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      const err = new Error('Validation failed');
      Object.assign(err, { errors });
      throw err;
    }
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;