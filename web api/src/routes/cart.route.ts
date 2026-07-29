import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const cartRouter = Router();
const cartControllerInstance = controllers.cart;

cartRouter.use(authenticate);

cartRouter.get("/", cartControllerInstance.getCart.bind(cartControllerInstance));
cartRouter.post("/items", cartControllerInstance.addItem.bind(cartControllerInstance));
cartRouter.put("/items/:productId", cartControllerInstance.updateItem.bind(cartControllerInstance));
cartRouter.delete("/items/:productId", cartControllerInstance.removeItem.bind(cartControllerInstance));
cartRouter.delete("/", cartControllerInstance.clearCart.bind(cartControllerInstance));

export default cartRouter;
