import mongoose, { Schema, Document } from "mongoose";
import { BrandDataType } from "../types/brand.type";

export interface IBrandDocument extends BrandDataType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    origin: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export const BrandCollection = mongoose.model<IBrandDocument>("Brand", BrandSchema, "brands");
