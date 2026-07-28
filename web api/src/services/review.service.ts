import { ReviewRepositoryMongo } from "../repositories/review.repository";
import { ProductRepositoryMongo } from "../repositories/product.repository";
import { CreateReviewDTO } from "../dtos/review.dto";
import { CustomHttpException } from "../exceptions/http-exception";

const reviewRepoInstance = new ReviewRepositoryMongo();
const productRepoInstance = new ProductRepositoryMongo();

async function syncProductRating(productId: string) {
  const stats = await reviewRepoInstance.getRatingStats(productId);
  await productRepoInstance.updateById(productId, {
    rating: Math.round(stats.avgRating * 10) / 10,
    reviewCount: stats.count
  });
}

export class ReviewService {
  async listReviewsForProduct(productId: string) {
    return await reviewRepoInstance.findByProduct(productId);
  }

  async createReview(userId: string, data: CreateReviewDTO) {
    const product = await productRepoInstance.findById(data.productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const existing = await reviewRepoInstance.findByProductAndUser(data.productId, userId);
    if (existing) {
      throw new CustomHttpException(400, "You have already reviewed this product");
    }

    const review = await reviewRepoInstance.create({ ...data, userId } as any);
    await syncProductRating(data.productId);
    return review;
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await reviewRepoInstance.findById(reviewId);
    if (!review) {
      throw new CustomHttpException(404, "Review not found");
    }
    if (review.userId.toString() !== userId) {
      throw new CustomHttpException(403, "You can only delete your own review");
    }

    await reviewRepoInstance.deleteById(reviewId);
    await syncProductRating(review.productId.toString());
  }
}
