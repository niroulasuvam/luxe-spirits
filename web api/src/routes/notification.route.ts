import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { controllers } from "../application/container";

const notificationRouter = Router();
const notificationControllerInstance = controllers.notification;

notificationRouter.use(authenticate);
notificationRouter.get("/", notificationControllerInstance.list.bind(notificationControllerInstance));
notificationRouter.put("/read-all", notificationControllerInstance.markAllRead.bind(notificationControllerInstance));
notificationRouter.delete("/", notificationControllerInstance.clearAll.bind(notificationControllerInstance));

export default notificationRouter;
