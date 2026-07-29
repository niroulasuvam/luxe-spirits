import { ICouponRepository } from "../repositories/coupon.repository";
import { CreateCouponDTO, UpdateCouponDTO } from "../dtos/coupon.dto";
import { CustomHttpException } from "../exceptions/http-exception";

export class CouponService {
  constructor(private readonly couponRepo: ICouponRepository) {}

  async listCoupons() {
    return await this.couponRepo.findAll();
  }

  async createCoupon(data: CreateCouponDTO) {
    const existing = await this.couponRepo.findByCode(data.code);
    if (existing) {
      throw new CustomHttpException(400, "A coupon with this code already exists");
    }
    return await this.couponRepo.create(data);
  }

  async updateCoupon(id: string, updates: UpdateCouponDTO) {
    const updated = await this.couponRepo.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Coupon not found");
    }
    return updated;
  }

  async deleteCoupon(id: string) {
    const deleted = await this.couponRepo.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Coupon not found");
    }
    return deleted;
  }

  async applyCoupon(code: string, subtotal: number) {
    const coupon = await this.couponRepo.findByCode(code);
    if (!coupon) {
      throw new CustomHttpException(404, "Invalid coupon code");
    }
    if (!coupon.isActive) {
      throw new CustomHttpException(400, "This coupon is no longer active");
    }
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
      throw new CustomHttpException(400, "This coupon has expired");
    }

    const rawDiscount =
      coupon.discountType === "percentage" ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
    const discountAmount = Math.round(Math.min(rawDiscount, subtotal));

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    };
  }
}
