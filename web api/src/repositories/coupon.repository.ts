import { CouponCollection, ICouponDocument } from "../models/coupon.model";

export interface ICouponRepository {
  findAll(): Promise<ICouponDocument[]>;
  findById(id: string): Promise<ICouponDocument | null>;
  findByCode(code: string): Promise<ICouponDocument | null>;
  create(data: Partial<ICouponDocument>): Promise<ICouponDocument>;
  updateById(id: string, updates: Partial<ICouponDocument>): Promise<ICouponDocument | null>;
  deleteById(id: string): Promise<ICouponDocument | null>;
}

export class CouponRepositoryMongo implements ICouponRepository {
  async findAll(): Promise<ICouponDocument[]> {
    return await CouponCollection.find({}).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ICouponDocument | null> {
    return await CouponCollection.findById(id);
  }

  async findByCode(code: string): Promise<ICouponDocument | null> {
    return await CouponCollection.findOne({ code: code.toUpperCase() });
  }

  async create(data: Partial<ICouponDocument>): Promise<ICouponDocument> {
    return await CouponCollection.create(data);
  }

  async updateById(id: string, updates: Partial<ICouponDocument>): Promise<ICouponDocument | null> {
    return await CouponCollection.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  }

  async deleteById(id: string): Promise<ICouponDocument | null> {
    return await CouponCollection.findByIdAndDelete(id);
  }
}
