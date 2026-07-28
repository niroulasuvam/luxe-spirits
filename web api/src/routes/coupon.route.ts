import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";
import { authenticate } from "../middlewares/auth.middleware";

const couponRouter = Router();
const couponControllerInstance = new CouponController();

couponRouter.get("/", couponControllerInstance.listCoupons.bind(couponControllerInstance));
couponRouter.post("/apply", couponControllerInstance.applyCoupon.bind(couponControllerInstance));
couponRouter.post("/", authenticate, couponControllerInstance.createCoupon.bind(couponControllerInstance));
couponRouter.put("/:id", authenticate, couponControllerInstance.updateCoupon.bind(couponControllerInstance));
couponRouter.delete("/:id", authenticate, couponControllerInstance.deleteCoupon.bind(couponControllerInstance));

export default couponRouter;
