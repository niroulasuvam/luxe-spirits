import mongoose, { Schema, Document } from "mongoose";

export interface IProductDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  origin: string;
  age: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  notes: string[];
  abv: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    origin: { type: String, required: true },
    age: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String },
    image: { type: String, required: true },
    notes: [{ type: String }],
    abv: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const ProductCollection = mongoose.model<IProductDocument>("Product", ProductSchema, "products");
