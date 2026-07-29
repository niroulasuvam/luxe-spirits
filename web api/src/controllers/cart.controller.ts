import { z } from "zod";
import { Response } from "express";
import { CartService } from "../services/cart.service";
import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await this.cartService.getCart(req.userId!);
      return ResponseFormatter.successResponse(res, cart, "Cart fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = AddCartItemDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const cart = await this.cartService.addItem(
        req.userId!,
        validationResult.data.productId,
        validationResult.data.quantity
      );
      return ResponseFormatter.successResponse(res, cart, "Item added to cart");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateItem(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = UpdateCartItemDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const cart = await this.cartService.updateItemQuantity(
        req.userId!,
        req.params.productId as string,
        validationResult.data.quantity
      );
      return ResponseFormatter.successResponse(res, cart, "Cart updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await this.cartService.removeItem(req.userId!, req.params.productId as string);
      return ResponseFormatter.successResponse(res, cart, "Item removed from cart");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await this.cartService.clearCart(req.userId!);
      return ResponseFormatter.successResponse(res, cart, "Cart cleared");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
