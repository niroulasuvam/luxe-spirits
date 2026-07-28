import mongoose, { Schema, Document } from "mongoose";
import { UserDataType } from "../types/user.type";

export interface IUserDocument extends UserDataType, Document {
  _id: mongoose.Types.ObjectId;
  profilePicture?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    ageVerified: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    bio: { type: String },
    profilePicture: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false }
  },
  { timestamps: true }
);

export const UserCollection = mongoose.model<IUserDocument>("User", UserSchema);
