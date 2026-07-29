import { IWishlistRepository } from "../repositories/wishlist.repository";
import { IProductRepository } from "../repositories/product.repository";
import { CustomHttpException } from "../exceptions/http-exception";
import { IWishlistDocument } from "../models/wishlist.model";

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
  constructor(
    private readonly wishlistRepo: IWishlistRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async getWishlist(userId: string) {
    const wishlist = await this.wishlistRepo.findByUserId(userId);
    return toWishlistResponse(wishlist);
  }

  async toggleProduct(userId: string, productId: string) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const existing = await this.wishlistRepo.findByUserId(userId);
    const alreadyInWishlist = (existing?.productIds || []).some((id) => productIdToString(id) === productId);

    const wishlist = alreadyInWishlist
      ? await this.wishlistRepo.removeProduct(userId, productId)
      : await this.wishlistRepo.addProduct(userId, productId);

    return { ...toWishlistResponse(wishlist), added: !alreadyInWishlist };
  }
}
