import { Response } from "express";
import { PaymentService } from "../services/payment.service";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async getPaymentForOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const payment = await this.paymentService.getPaymentForOrder(req.userId!, req.params.orderNumber as string);
      return ResponseFormatter.successResponse(res, payment, "Payment fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
