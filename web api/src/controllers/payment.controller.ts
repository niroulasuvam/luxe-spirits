import { Response } from "express";
import { PaymentService } from "../services/payment.service";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const paymentServiceInstance = new PaymentService();

export class PaymentController {
  async getPaymentForOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const payment = await paymentServiceInstance.getPaymentForOrder(req.userId!, req.params.orderNumber as string);
      return ResponseFormatter.successResponse(res, payment, "Payment fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
