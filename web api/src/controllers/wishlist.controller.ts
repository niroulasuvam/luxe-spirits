import { z } from "zod";
import { Response } from "express";
import { WishlistService } from "../services/wishlist.service";
import { ToggleWishlistDTO } from "../dtos/wishlist.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  async getWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const wishlist = await this.wishlistService.getWishlist(req.userId!);
      return ResponseFormatter.successResponse(res, wishlist, "Wishlist fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async toggleProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ToggleWishlistDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const wishlist = await this.wishlistService.toggleProduct(req.userId!, validationResult.data.productId);
      return ResponseFormatter.successResponse(res, wishlist, "Wishlist updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
