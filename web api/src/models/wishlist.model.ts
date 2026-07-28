import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    productIds: { type: [Schema.Types.ObjectId], ref: "Product", default: [] }
  },
  { timestamps: true }
);

export const WishlistCollection = mongoose.model<IWishlistDocument>("Wishlist", WishlistSchema, "wishlists");
