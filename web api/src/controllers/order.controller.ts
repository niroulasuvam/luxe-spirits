import { z } from "zod";
import { Response } from "express";
import { OrderService } from "../services/order.service";
import { CreateOrderDTO } from "../dtos/order.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const orderServiceInstance = new OrderService();

export class OrderController {
  async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const status = String(req.body.status || "");
      if (!["pending", "accepted", "shipped", "delivered", "cancelled"].includes(status)) {
        return ResponseFormatter.errorResponse(res, "Invalid order status", 400);
      }
      const estimatedHours = Number(req.body.estimatedHours);
      const order = await orderServiceInstance.updateOrderStatus(
        req.params.id as string,
        status,
        Number.isFinite(estimatedHours) && estimatedHours > 0 ? estimatedHours : undefined
      );
      return ResponseFormatter.successResponse(res, order, "Order updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async listAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await orderServiceInstance.listAllOrders();
      return ResponseFormatter.successResponse(res, orders, "Orders fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = CreateOrderDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const order = await orderServiceInstance.createOrderFromCart(req.userId!, validationResult.data);
      return ResponseFormatter.successResponse(res, order, "Order placed successfully", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async listMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await orderServiceInstance.listMyOrders(req.userId!);
      return ResponseFormatter.successResponse(res, orders, "Orders fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async getMyOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await orderServiceInstance.getMyOrder(req.userId!, req.params.orderNumber as string);
      return ResponseFormatter.successResponse(res, order, "Order fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
