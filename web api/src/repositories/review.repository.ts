import mongoose from "mongoose";
import { ReviewCollection, IReviewDocument } from "../models/review.model";

export type RatingStats = { avgRating: number; count: number };

export interface IReviewRepository {
  findByProduct(productId: string): Promise<IReviewDocument[]>;
  findByProductAndUser(productId: string, userId: string): Promise<IReviewDocument | null>;
  findById(id: string): Promise<IReviewDocument | null>;
  create(data: Partial<IReviewDocument>): Promise<IReviewDocument>;
  deleteById(id: string): Promise<IReviewDocument | null>;
  getRatingStats(productId: string): Promise<RatingStats>;
}

export class ReviewRepositoryMongo implements IReviewRepository {
  async findByProduct(productId: string): Promise<IReviewDocument[]> {
    return await ReviewCollection.find({ productId })
      .populate({ path: "userId", select: "fullName profilePicture" })
      .sort({ createdAt: -1 });
  }

  async findByProductAndUser(productId: string, userId: string): Promise<IReviewDocument | null> {
    return await ReviewCollection.findOne({ productId, userId });
  }

  async findById(id: string): Promise<IReviewDocument | null> {
    return await ReviewCollection.findById(id);
  }

  async create(data: Partial<IReviewDocument>): Promise<IReviewDocument> {
    return await ReviewCollection.create(data);
  }

  async deleteById(id: string): Promise<IReviewDocument | null> {
    return await ReviewCollection.findByIdAndDelete(id);
  }

  async getRatingStats(productId: string): Promise<RatingStats> {
    const result = await ReviewCollection.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    if (result.length === 0) {
      return { avgRating: 0, count: 0 };
    }
    return { avgRating: result[0].avgRating, count: result[0].count };
  }
}
