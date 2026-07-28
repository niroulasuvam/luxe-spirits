import { CouponRepositoryMongo } from "../repositories/coupon.repository";
import { CreateCouponDTO, UpdateCouponDTO } from "../dtos/coupon.dto";
import { CustomHttpException } from "../exceptions/http-exception";

const couponRepoInstance = new CouponRepositoryMongo();

export class CouponService {
  async listCoupons() {
    return await couponRepoInstance.findAll();
  }

  async createCoupon(data: CreateCouponDTO) {
    const existing = await couponRepoInstance.findByCode(data.code);
    if (existing) {
      throw new CustomHttpException(400, "A coupon with this code already exists");
    }
    return await couponRepoInstance.create(data);
  }

  async updateCoupon(id: string, updates: UpdateCouponDTO) {
    const updated = await couponRepoInstance.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Coupon not found");
    }
    return updated;
  }

  async deleteCoupon(id: string) {
    const deleted = await couponRepoInstance.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Coupon not found");
    }
    return deleted;
  }

  async applyCoupon(code: string, subtotal: number) {
    const coupon = await couponRepoInstance.findByCode(code);
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
