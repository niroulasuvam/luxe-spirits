import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const categoryRouter = Router();
const categoryControllerInstance = new CategoryController();

categoryRouter.get("/", categoryControllerInstance.listCategories.bind(categoryControllerInstance));
categoryRouter.get("/:slug", categoryControllerInstance.getCategory.bind(categoryControllerInstance));
categoryRouter.post("/", authenticate, categoryControllerInstance.createCategory.bind(categoryControllerInstance));
categoryRouter.put("/:id", authenticate, categoryControllerInstance.updateCategory.bind(categoryControllerInstance));
categoryRouter.delete("/:id", authenticate, categoryControllerInstance.deleteCategory.bind(categoryControllerInstance));

export default categoryRouter;
