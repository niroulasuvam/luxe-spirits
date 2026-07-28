import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const paymentRouter = Router();
const paymentControllerInstance = new PaymentController();

paymentRouter.use(authenticate);

paymentRouter.get("/:orderNumber", paymentControllerInstance.getPaymentForOrder.bind(paymentControllerInstance));

export default paymentRouter;
