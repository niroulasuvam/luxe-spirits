import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const categoryRouter = Router();
const categoryControllerInstance = controllers.category;

categoryRouter.get("/", categoryControllerInstance.listCategories.bind(categoryControllerInstance));
categoryRouter.get("/:slug", categoryControllerInstance.getCategory.bind(categoryControllerInstance));
categoryRouter.post("/", authenticate, categoryControllerInstance.createCategory.bind(categoryControllerInstance));
categoryRouter.put("/:id", authenticate, categoryControllerInstance.updateCategory.bind(categoryControllerInstance));
categoryRouter.delete("/:id", authenticate, categoryControllerInstance.deleteCategory.bind(categoryControllerInstance));

export default categoryRouter;
