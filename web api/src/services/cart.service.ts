import { CartRepositoryMongo } from "../repositories/cart.repository";
import { ProductRepositoryMongo } from "../repositories/product.repository";
import { CustomHttpException } from "../exceptions/http-exception";
import { ICartDocument } from "../models/cart.model";

const cartRepoInstance = new CartRepositoryMongo();
const productRepoInstance = new ProductRepositoryMongo();

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
  async getCart(userId: string) {
    const cart = await cartRepoInstance.findByUserId(userId);
    return toCartResponse(cart);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await productRepoInstance.findById(productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const cart = await cartRepoInstance.upsertItem(userId, productId, quantity);
    return toCartResponse(cart);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await cartRepoInstance.setItemQuantity(userId, productId, quantity);
    return toCartResponse(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await cartRepoInstance.removeItem(userId, productId);
    return toCartResponse(cart);
  }

  async clearCart(userId: string) {
    const cart = await cartRepoInstance.clear(userId);
    return toCartResponse(cart);
  }
}
