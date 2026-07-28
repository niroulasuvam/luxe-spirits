import mongoose, { Schema, Document } from "mongoose";
import { CategoryDataType } from "../types/category.type";

export interface ICategoryDocument extends CategoryDataType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String }
  },
  { timestamps: true }
);

export const CategoryCollection = mongoose.model<ICategoryDocument>("Category", CategorySchema, "categories");
