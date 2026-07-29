import { Router } from "express";
import { controllers } from "../application/container";
import { authenticate } from "../middlewares/auth.middleware";

const reviewRouter = Router();
const reviewControllerInstance = controllers.review;

reviewRouter.get("/", reviewControllerInstance.listReviews.bind(reviewControllerInstance));
reviewRouter.post("/", authenticate, reviewControllerInstance.createReview.bind(reviewControllerInstance));
reviewRouter.delete("/:id", authenticate, reviewControllerInstance.deleteReview.bind(reviewControllerInstance));

export default reviewRouter;
