import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";

const wishlistRouter = Router();
const wishlistControllerInstance = new WishlistController();

wishlistRouter.use(authenticate);

wishlistRouter.get("/", wishlistControllerInstance.getWishlist.bind(wishlistControllerInstance));
wishlistRouter.post("/toggle", wishlistControllerInstance.toggleProduct.bind(wishlistControllerInstance));

export default wishlistRouter;
