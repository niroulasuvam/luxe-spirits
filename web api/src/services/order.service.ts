import crypto from "crypto";
import { IOrderRepository } from "../repositories/order.repository";
import { IPaymentRepository } from "../repositories/payment.repository";
import { ICartRepository } from "../repositories/cart.repository";
import { INotificationRepository } from "../repositories/notification.repository";
import { CreateOrderDTO } from "../dtos/order.dto";
import { CustomHttpException } from "../exceptions/http-exception";
import { CLIENT_URL } from "../configs/constant";

const TAX_RATE = 0.13;
const DELIVERY_WINDOW_DAYS = 7;

function generateOrderNumber() {
  return `LS-${Date.now().toString(36).toUpperCase()}${crypto.randomInt(100, 999)}`;
}

export class OrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly paymentRepo: IPaymentRepository,
    private readonly cartRepo: ICartRepository,
    private readonly notificationRepo: INotificationRepository
  ) {}

  async listAllOrders() {
    return await this.orderRepo.findAll();
  }

  async updateOrderStatus(id: string, status: string, estimatedHours?: number) {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new CustomHttpException(404, "Order not found");
    }

    const expectedDelivery = estimatedHours && estimatedHours > 0
      ? new Date(Date.now() + estimatedHours * 60 * 60 * 1000)
      : undefined;
    const updated = await this.orderRepo.updateStatus(id, status, expectedDelivery);
    if (!updated) {
      throw new CustomHttpException(404, "Order not found");
    }

    await this.notificationRepo.create({
      userId: updated.userId,
      title: this.getStatusNotificationTitle(status),
      message: this.getStatusNotificationMessage(status, updated.orderNumber, estimatedHours),
      href: `${CLIENT_URL}/orders`
    } as any);

    return updated;
  }

  private getStatusNotificationTitle(status: string) {
    if (status === "accepted") return "Order accepted";
    if (status === "shipped") return "Order shipped";
    if (status === "delivered") return "Order delivered";
    if (status === "cancelled") return "Order cancelled";
    return "Order updated";
  }

  private getStatusNotificationMessage(status: string, orderNumber: string, estimatedHours?: number) {
    const eta = estimatedHours && estimatedHours > 0 ? ` You will receive your order in about ${estimatedHours} hour${estimatedHours === 1 ? "" : "s"}.` : "";
    if (status === "accepted") return `Customer, your order #${orderNumber} is accepted.${eta}`;
    if (status === "shipped") return `Your order #${orderNumber} is now shipping.${eta}`;
    if (status === "delivered") return `Your order #${orderNumber} has been delivered. Thank you.`;
    if (status === "cancelled") return `Your order #${orderNumber} has been cancelled.`;
    return `Your order #${orderNumber} was updated.`;
  }

  async createOrderFromCart(userId: string, payload: CreateOrderDTO) {
    const cart = await this.cartRepo.findByUserId(userId);
    const cartItems = (cart?.items || []).filter((item) => item.productId && typeof item.productId === "object");

    if (cartItems.length === 0) {
      throw new CustomHttpException(400, "Your cart is empty");
    }

    const items = cartItems.map((item) => {
      const product = item.productId as unknown as { _id: string; name: string; image: string; price: number };
      return {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + DELIVERY_WINDOW_DAYS);

    const order = await this.orderRepo.create({
      userId: userId as any,
      orderNumber: generateOrderNumber(),
      items: items as any,
      subtotal,
      tax,
      total,
      shippingAddress: {
        streetAddress: payload.streetAddress,
        city: payload.city,
        zipCode: payload.zipCode
      },
      status: "pending",
      expectedDelivery
    });

    await this.paymentRepo.create({
      orderId: order._id,
      userId: userId as any,
      amount: total,
      method: payload.paymentMethod,
      paymentReference: payload.paymentReference,
      status: "succeeded"
    });

    await this.cartRepo.clear(userId);

    return order;
  }

  async listMyOrders(userId: string) {
    return await this.orderRepo.findByUserId(userId);
  }

  async getMyOrder(userId: string, orderNumber: string) {
    const order = await this.orderRepo.findByOrderNumber(orderNumber);
    if (!order || order.userId.toString() !== userId) {
      throw new CustomHttpException(404, "Order not found");
    }
    return order;
  }
}
