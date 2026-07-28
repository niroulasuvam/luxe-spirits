import { PaymentRepositoryMongo } from "../repositories/payment.repository";
import { OrderRepositoryMongo } from "../repositories/order.repository";
import { CustomHttpException } from "../exceptions/http-exception";

const paymentRepoInstance = new PaymentRepositoryMongo();
const orderRepoInstance = new OrderRepositoryMongo();

export class PaymentService {
  async getPaymentForOrder(userId: string, orderNumber: string) {
    const order = await orderRepoInstance.findByOrderNumber(orderNumber);
    if (!order || order.userId.toString() !== userId) {
      throw new CustomHttpException(404, "Order not found");
    }

    const payment = await paymentRepoInstance.findByOrderId(order._id.toString());
    if (!payment) {
      throw new CustomHttpException(404, "Payment not found");
    }
    return payment;
  }
}
