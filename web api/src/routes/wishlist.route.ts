import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const wishlistRouter = Router();
const wishlistControllerInstance = controllers.wishlist;

wishlistRouter.use(authenticate);

wishlistRouter.get("/", wishlistControllerInstance.getWishlist.bind(wishlistControllerInstance));
wishlistRouter.post("/toggle", wishlistControllerInstance.toggleProduct.bind(wishlistControllerInstance));

export default wishlistRouter;
