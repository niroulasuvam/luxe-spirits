import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { productImageUpload } from "../utils/upload.util";

const productRouter = Router();
const productControllerInstance = new ProductController();

productRouter.get("/", productControllerInstance.listProducts.bind(productControllerInstance));
productRouter.post("/ai-search", productControllerInstance.aiSearch.bind(productControllerInstance));
productRouter.get("/:slug", productControllerInstance.getProduct.bind(productControllerInstance));
productRouter.post("/", authenticate, requireAdmin, productImageUpload.single("image"), productControllerInstance.createProduct.bind(productControllerInstance));
productRouter.put("/:id", authenticate, requireAdmin, productImageUpload.single("image"), productControllerInstance.updateProduct.bind(productControllerInstance));
productRouter.delete("/:id", authenticate, requireAdmin, productControllerInstance.deleteProduct.bind(productControllerInstance));

export default productRouter;
