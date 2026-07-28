import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { notificationImageUpload } from "../utils/upload.util";

const adminRouter = Router();
const adminControllerInstance = new AdminController();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/users", adminControllerInstance.listUsers.bind(adminControllerInstance));
adminRouter.put("/users/:id", adminControllerInstance.updateUser.bind(adminControllerInstance));
adminRouter.delete("/users/:id", adminControllerInstance.deleteUser.bind(adminControllerInstance));
adminRouter.post("/users/:id/recover-password", adminControllerInstance.sendPasswordRecovery.bind(adminControllerInstance));
adminRouter.post("/notify", notificationImageUpload.single("image"), adminControllerInstance.notifyUsers.bind(adminControllerInstance));

export default adminRouter;
