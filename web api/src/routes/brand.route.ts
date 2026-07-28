import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middleware";

const brandRouter = Router();
const brandControllerInstance = new BrandController();

brandRouter.get("/", brandControllerInstance.listBrands.bind(brandControllerInstance));
brandRouter.get("/:slug", brandControllerInstance.getBrand.bind(brandControllerInstance));
brandRouter.post("/", authenticate, brandControllerInstance.createBrand.bind(brandControllerInstance));
brandRouter.put("/:id", authenticate, brandControllerInstance.updateBrand.bind(brandControllerInstance));
brandRouter.delete("/:id", authenticate, brandControllerInstance.deleteBrand.bind(brandControllerInstance));

export default brandRouter;
