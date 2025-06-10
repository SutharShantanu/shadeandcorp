import mongoose from "mongoose";
import {
  AccountStatusEnum,
  AddressTypeEnum,
  FALSE,
  GenderEnum,
  REQUIRED,
  RoleEnum,
  TRUE,
} from "./enums/users.enum";

const sessionSchema = new mongoose.Schema({
  ipAddress: { type: String, required: REQUIRED },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  timezone: { type: String },
  org: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  deviceInfo: {
    type: Map,
    of: String,
    default: {},
  },
  loggedInAt: { type: Date, default: Date.now, required: TRUE },
});

const addressSchema = new mongoose.Schema({
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: DefaultValues.COUNTRY },
  type: {
    type: String,
    enum: AddressTypeEnum,
    default: AddressTypeEnum.HOME,
  },
  isDefault: { type: Boolean, default: FALSE },
});

const paymentMethodSchema = new mongoose.Schema({
  cardNumber: { type: String },
  expiryDate: { type: String },
  cardHolderName: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: TRUE },
    lastName: { type: String },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: "",
    },
    birthday: { type: Date },
    email: { type: String, required: TRUE, unique: TRUE },
    phone: { type: String, required: TRUE },
    countryCode: { type: String, required: TRUE },
    address: [addressSchema],
    profilePicture: { type: String, default: "" },
    password: { type: String, required: TRUE },
    isVerified: { type: Boolean, default: FALSE },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatusEnum),
      default: AccountStatusEnum.ACTIVE,
    },
    sessions: [sessionSchema],
    paymentMethods: [paymentMethodSchema],
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: TRUE, collection: "shadeandcorp" }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
