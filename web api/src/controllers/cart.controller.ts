import { z } from "zod";
import { Response } from "express";
import { CartService } from "../services/cart.service";
import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const cartServiceInstance = new CartService();

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await cartServiceInstance.getCart(req.userId!);
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
      const cart = await cartServiceInstance.addItem(
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
      const cart = await cartServiceInstance.updateItemQuantity(
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
      const cart = await cartServiceInstance.removeItem(req.userId!, req.params.productId as string);
      return ResponseFormatter.successResponse(res, cart, "Item removed from cart");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await cartServiceInstance.clearCart(req.userId!);
      return ResponseFormatter.successResponse(res, cart, "Cart cleared");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
