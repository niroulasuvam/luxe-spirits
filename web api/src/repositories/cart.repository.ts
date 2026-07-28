import { CartCollection, ICartDocument } from "../models/cart.model";

const PRODUCT_POPULATE = { path: "items.productId", select: "name slug image price oldPrice" };

export interface ICartRepository {
  findByUserId(userId: string): Promise<ICartDocument | null>;
  upsertItem(userId: string, productId: string, quantity: number): Promise<ICartDocument | null>;
  setItemQuantity(userId: string, productId: string, quantity: number): Promise<ICartDocument | null>;
  removeItem(userId: string, productId: string): Promise<ICartDocument | null>;
  clear(userId: string): Promise<ICartDocument | null>;
}

export class CartRepositoryMongo implements ICartRepository {
  async findByUserId(userId: string): Promise<ICartDocument | null> {
    return await CartCollection.findOne({ userId }).populate(PRODUCT_POPULATE);
  }

  async upsertItem(userId: string, productId: string, quantity: number): Promise<ICartDocument | null> {
    const existing = await CartCollection.findOne({ userId, "items.productId": productId });

    if (existing) {
      return await CartCollection.findOneAndUpdate(
        { userId, "items.productId": productId },
        { $inc: { "items.$.quantity": quantity } },
        { returnDocument: "after" }
      ).populate(PRODUCT_POPULATE);
    }

    return await CartCollection.findOneAndUpdate(
      { userId },
      { $push: { items: { productId, quantity } } },
      { upsert: true, returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }

  async setItemQuantity(userId: string, productId: string, quantity: number): Promise<ICartDocument | null> {
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }

    return await CartCollection.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } },
      { returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }

  async removeItem(userId: string, productId: string): Promise<ICartDocument | null> {
    return await CartCollection.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }

  async clear(userId: string): Promise<ICartDocument | null> {
    return await CartCollection.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { upsert: true, returnDocument: "after" }
    ).populate(PRODUCT_POPULATE);
  }
}
