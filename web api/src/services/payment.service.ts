import { IPaymentRepository } from "../repositories/payment.repository";
import { IOrderRepository } from "../repositories/order.repository";
import { CustomHttpException } from "../exceptions/http-exception";

export class PaymentService {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly orderRepo: IOrderRepository
  ) {}

  async getPaymentForOrder(userId: string, orderNumber: string) {
    const order = await this.orderRepo.findByOrderNumber(orderNumber);
    if (!order || order.userId.toString() !== userId) {
      throw new CustomHttpException(404, "Order not found");
    }

    const payment = await this.paymentRepo.findByOrderId(order._id.toString());
    if (!payment) {
      throw new CustomHttpException(404, "Payment not found");
    }
    return payment;
  }
}
