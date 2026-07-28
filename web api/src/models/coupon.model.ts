import mongoose, { Schema, Document } from "mongoose";

export type DiscountType = "percentage" | "fixed";

export interface ICouponDocument extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CouponCollection = mongoose.model<ICouponDocument>("Coupon", CouponSchema, "coupons");
