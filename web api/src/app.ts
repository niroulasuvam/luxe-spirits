import express, { Application, NextFunction, Request, Response } from "express";
import multer from "multer";
import { CustomHttpException } from "./exceptions/http-exception";
import { ResponseFormatter } from "./utils/apihelper.util";
import { UPLOADS_ROOT } from "./utils/upload.util";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import brandRouter from "./routes/brand.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import orderRouter from "./routes/order.route";
import paymentRouter from "./routes/payment.route";
import couponRouter from "./routes/coupon.route";
import reviewRouter from "./routes/review.route";
import wishlistRouter from "./routes/wishlist.route";
import adminRouter from "./routes/admin.route";
import notificationRouter from "./routes/notification.route";

const app: Application = express();

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/uploads", express.static(UPLOADS_ROOT));

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/notifications", notificationRouter);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "Endpoint not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (err instanceof CustomHttpException) {
    return ResponseFormatter.errorResponse(res, err.message, err.status);
  }
  if (err instanceof multer.MulterError) {
    return ResponseFormatter.errorResponse(res, err.message, 400);
  }
  if (err.message === "Only image files are allowed") {
    return ResponseFormatter.errorResponse(res, err.message, 400);
  }
  return ResponseFormatter.errorResponse(res, "Internal Server Error", 500);
});

export default app;
