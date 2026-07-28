import { WishlistCollection, IWishlistDocument } from "../models/wishlist.model";

const PRODUCT_POPULATE = { path: "productIds", select: "name slug image price badge" };

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<IWishlistDocument | null>;
  addProduct(userId: string, productId: string): Promise<IWishlistDocument | null>;
  removeProduct(userId: string, productId: string): Promise<IWishlistDocument | null>;
}

export class WishlistRepositoryMongo implements IWishlistRepository {
  async findByUserId(userId: string): Promise<IWishlistDocument | null> {
    return await WishlistCollection.findOne({ userId }).populate(PRODUCT_POPULATE);
  }

  async addProduct(userId: string, productId: string): Promise<IWishlistDocument | null> {
    return await WishlistCollection.findOneAndUpdate(
      { userId },
      { $addToSet: { productIds: productId } },
      { upsert: true, returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }

  async removeProduct(userId: string, productId: string): Promise<IWishlistDocument | null> {
    return await WishlistCollection.findOneAndUpdate(
      { userId },
      { $pull: { productIds: productId } },
      { returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }
}
