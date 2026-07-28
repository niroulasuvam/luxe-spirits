import mongoose, { Schema, Document } from "mongoose";

export type PaymentStatus = "succeeded" | "failed";

export interface IPaymentDocument extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  paymentReference?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: "esewa" },
    paymentReference: { type: String },
    status: { type: String, enum: ["succeeded", "failed"], default: "succeeded" }
  },
  { timestamps: true }
);

export const PaymentCollection = mongoose.model<IPaymentDocument>("Payment", PaymentSchema, "payments");
