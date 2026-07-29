import { IReviewRepository } from "../repositories/review.repository";
import { IProductRepository } from "../repositories/product.repository";
import { CreateReviewDTO } from "../dtos/review.dto";
import { CustomHttpException } from "../exceptions/http-exception";

export class ReviewService {
  constructor(
    private readonly reviewRepo: IReviewRepository,
    private readonly productRepo: IProductRepository
  ) {}

  private async syncProductRating(productId: string) {
    const stats = await this.reviewRepo.getRatingStats(productId);
    await this.productRepo.updateById(productId, {
      rating: Math.round(stats.avgRating * 10) / 10,
      reviewCount: stats.count
    });
  }

  async listReviewsForProduct(productId: string) {
    return await this.reviewRepo.findByProduct(productId);
  }

  async createReview(userId: string, data: CreateReviewDTO) {
    const product = await this.productRepo.findById(data.productId);
    if (!product) {
      throw new CustomHttpException(404, "Product not found");
    }

    const existing = await this.reviewRepo.findByProductAndUser(data.productId, userId);
    if (existing) {
      throw new CustomHttpException(400, "You have already reviewed this product");
    }

    const review = await this.reviewRepo.create({ ...data, userId } as any);
    await this.syncProductRating(data.productId);
    return review;
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new CustomHttpException(404, "Review not found");
    }
    if (review.userId.toString() !== userId) {
      throw new CustomHttpException(403, "You can only delete your own review");
    }

    await this.reviewRepo.deleteById(reviewId);
    await this.syncProductRating(review.productId.toString());
  }
}
