import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { NotificationController } from "../controllers/notification.controller";

const notificationRouter = Router();
const notificationControllerInstance = new NotificationController();

notificationRouter.use(authenticate);
notificationRouter.get("/", notificationControllerInstance.list.bind(notificationControllerInstance));
notificationRouter.put("/read-all", notificationControllerInstance.markAllRead.bind(notificationControllerInstance));
notificationRouter.delete("/", notificationControllerInstance.clearAll.bind(notificationControllerInstance));

export default notificationRouter;
