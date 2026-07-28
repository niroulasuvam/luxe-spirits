import { z } from "zod";
import { Response } from "express";
import { CouponService } from "../services/coupon.service";
import { CreateCouponDTO, UpdateCouponDTO, ApplyCouponDTO } from "../dtos/coupon.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const couponServiceInstance = new CouponService();

export class CouponController {
  async listCoupons(req: AuthenticatedRequest, res: Response) {
    try {
      const coupons = await couponServiceInstance.listCoupons();
      return ResponseFormatter.successResponse(res, coupons, "Coupons fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = CreateCouponDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const coupon = await couponServiceInstance.createCoupon(validationResult.data);
      return ResponseFormatter.successResponse(res, coupon, "Coupon created", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = UpdateCouponDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const coupon = await couponServiceInstance.updateCoupon(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, coupon, "Coupon updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      await couponServiceInstance.deleteCoupon(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Coupon deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async applyCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ApplyCouponDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const result = await couponServiceInstance.applyCoupon(validationResult.data.code, validationResult.data.subtotal);
      return ResponseFormatter.successResponse(res, result, "Coupon applied");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
