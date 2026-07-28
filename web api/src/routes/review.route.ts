import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";

const reviewRouter = Router();
const reviewControllerInstance = new ReviewController();

reviewRouter.get("/", reviewControllerInstance.listReviews.bind(reviewControllerInstance));
reviewRouter.post("/", authenticate, reviewControllerInstance.createReview.bind(reviewControllerInstance));
reviewRouter.delete("/:id", authenticate, reviewControllerInstance.deleteReview.bind(reviewControllerInstance));

export default reviewRouter;
