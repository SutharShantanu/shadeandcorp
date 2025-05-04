import mongoose from "mongoose";
import { AccountStatusEnum, GenderEnum, RoleEnum } from "./enums/users.enum";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
    },
    location: { type: String },
    deliveryAddresses: [{ type: String }],
    joinedDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
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
    sessions: [
      {
        ipAddress: { type: String },
        deviceInfo: { type: String },
        location: { type: String },
        loggedInAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, collection: "shadeandcorp" }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
