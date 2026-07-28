import { z } from "zod";
import { Response } from "express";
import { ReviewService } from "../services/review.service";
import { CreateReviewDTO } from "../dtos/review.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const reviewServiceInstance = new ReviewService();

export class ReviewController {
  async listReviews(req: AuthenticatedRequest, res: Response) {
    try {
      const productId = req.query.productId as string | undefined;
      if (!productId) {
        return ResponseFormatter.errorResponse(res, "productId query parameter is required", 400);
      }
      const reviews = await reviewServiceInstance.listReviewsForProduct(productId);
      return ResponseFormatter.successResponse(res, reviews, "Reviews fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = CreateReviewDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const review = await reviewServiceInstance.createReview(req.userId!, validationResult.data);
      return ResponseFormatter.successResponse(res, review, "Review submitted", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteReview(req: AuthenticatedRequest, res: Response) {
    try {
      await reviewServiceInstance.deleteReview(req.userId!, req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Review deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
