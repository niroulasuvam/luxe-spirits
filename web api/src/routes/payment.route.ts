import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const paymentRouter = Router();
const paymentControllerInstance = controllers.payment;

paymentRouter.use(authenticate);

paymentRouter.get("/:orderNumber", paymentControllerInstance.getPaymentForOrder.bind(paymentControllerInstance));

export default paymentRouter;
