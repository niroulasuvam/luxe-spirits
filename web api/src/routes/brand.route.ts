import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const brandRouter = Router();
const brandControllerInstance = controllers.brand;

brandRouter.get("/", brandControllerInstance.listBrands.bind(brandControllerInstance));
brandRouter.get("/:slug", brandControllerInstance.getBrand.bind(brandControllerInstance));
brandRouter.post("/", authenticate, brandControllerInstance.createBrand.bind(brandControllerInstance));
brandRouter.put("/:id", authenticate, brandControllerInstance.updateBrand.bind(brandControllerInstance));
brandRouter.delete("/:id", authenticate, brandControllerInstance.deleteBrand.bind(brandControllerInstance));

export default brandRouter;
