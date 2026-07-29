import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const orderRouter = Router();
const orderControllerInstance = controllers.order;

orderRouter.use(authenticate);

orderRouter.get("/admin/all", requireAdmin, orderControllerInstance.listAllOrders.bind(orderControllerInstance));
orderRouter.put("/admin/:id/status", requireAdmin, orderControllerInstance.updateOrderStatus.bind(orderControllerInstance));
orderRouter.post("/", orderControllerInstance.createOrder.bind(orderControllerInstance));
orderRouter.get("/", orderControllerInstance.listMyOrders.bind(orderControllerInstance));
orderRouter.get("/:orderNumber", orderControllerInstance.getMyOrder.bind(orderControllerInstance));

export default orderRouter;
