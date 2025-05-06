import mongoose from "mongoose";
import { AccountStatusEnum, GenderEnum, RoleEnum } from "./enums/users.enum";

const sessionSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
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
  loggedInAt: { type: Date, default: Date.now, required: true },
});

const addressSchema = new mongoose.Schema({
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: "India" },
  countryCode: { type: String, default: "91" },
});

const paymentMethodSchema = new mongoose.Schema({
  cardNumber: { type: String },
  expiryDate: { type: String },
  cardHolderName: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: "don't know",
    },
    birthday: { type: Date },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: addressSchema,
    profilePicture: { type: String, default: "" },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatusEnum),
      default: "active",
    },
    sessions: [sessionSchema],
    paymentMethods: [paymentMethodSchema],
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "shadeandcorp" }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
