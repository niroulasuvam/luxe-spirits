import { ICartRepository } from "../repositories/cart.repository";
import { IProductRepository } from "../repositories/product.repository";
import { CustomHttpException } from "../exceptions/http-exception";
import { ICartDocument } from "../models/cart.model";

function toCartResponse(cart: ICartDocument | null) {
  if (!cart) {
    return { items: [], itemCount: 0, subtotal: 0 };
  }

  const items = cart.items
    .filter((item) => item.productId && typeof item.productId === "object")
    .map((item) => {
      const product = item.productId as unknown as {
        _id: string;
        name: string;
        slug: string;
        image: string;
        price: number;
        oldPrice?: number;
      };
      return {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: item.quantity
      };
    });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return { items, itemCount, subtotal };
}

export class CartService {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartRepo.findByUserId(userId);
    return toCartResponse(cart);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const cart = await this.cartRepo.upsertItem(userId, productId, quantity);
    return toCartResponse(cart);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.cartRepo.setItemQuantity(userId, productId, quantity);
    return toCartResponse(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartRepo.removeItem(userId, productId);
    return toCartResponse(cart);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.clear(userId);
    return toCartResponse(cart);
  }
}
