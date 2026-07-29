import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { notificationImageUpload } from "../utils/upload.util";

const adminRouter = Router();
const adminControllerInstance = controllers.admin;

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/users", adminControllerInstance.listUsers.bind(adminControllerInstance));
adminRouter.put("/users/:id", adminControllerInstance.updateUser.bind(adminControllerInstance));
adminRouter.delete("/users/:id", adminControllerInstance.deleteUser.bind(adminControllerInstance));
adminRouter.post("/users/:id/recover-password", adminControllerInstance.sendPasswordRecovery.bind(adminControllerInstance));
adminRouter.post("/notify", notificationImageUpload.single("image"), adminControllerInstance.notifyUsers.bind(adminControllerInstance));

export default adminRouter;
