import { WishlistRepositoryMongo } from "../repositories/wishlist.repository";
import { ProductRepositoryMongo } from "../repositories/product.repository";
import { CustomHttpException } from "../exceptions/http-exception";
import { IWishlistDocument } from "../models/wishlist.model";

const wishlistRepoInstance = new WishlistRepositoryMongo();
const productRepoInstance = new ProductRepositoryMongo();

function toWishlistResponse(wishlist: IWishlistDocument | null) {
  if (!wishlist) {
    return { products: [] };
  }
  const products = wishlist.productIds.filter((product) => typeof product === "object");
  return { products };
}

function productIdToString(product: unknown) {
  if (product && typeof product === "object" && "_id" in product) {
    return String((product as { _id: unknown })._id);
  }
  return String(product);
}

export class WishlistService {
  async getWishlist(userId: string) {
    const wishlist = await wishlistRepoInstance.findByUserId(userId);
    return toWishlistResponse(wishlist);
  }

  async toggleProduct(userId: string, productId: string) {
    const product = await productRepoInstance.findById(productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const existing = await wishlistRepoInstance.findByUserId(userId);
    const alreadyInWishlist = (existing?.productIds || []).some((id) => productIdToString(id) === productId);

    const wishlist = alreadyInWishlist
      ? await wishlistRepoInstance.removeProduct(userId, productId)
      : await wishlistRepoInstance.addProduct(userId, productId);

    return { ...toWishlistResponse(wishlist), added: !alreadyInWishlist };
  }
}
