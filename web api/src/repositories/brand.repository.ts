import { BrandCollection, IBrandDocument } from "../models/brand.model";

export interface IBrandRepository {
  findAll(): Promise<IBrandDocument[]>;
  findById(id: string): Promise<IBrandDocument | null>;
  findBySlug(slug: string): Promise<IBrandDocument | null>;
  create(data: Partial<IBrandDocument>): Promise<IBrandDocument>;
  updateById(id: string, updates: Partial<IBrandDocument>): Promise<IBrandDocument | null>;
  deleteById(id: string): Promise<IBrandDocument | null>;
}

export class BrandRepositoryMongo implements IBrandRepository {
  async findAll(): Promise<IBrandDocument[]> {
    return await BrandCollection.find({}).sort({ name: 1 });
  }

  async findById(id: string): Promise<IBrandDocument | null> {
    return await BrandCollection.findById(id);
  }

  async findBySlug(slug: string): Promise<IBrandDocument | null> {
    return await BrandCollection.findOne({ slug });
  }

  async create(data: Partial<IBrandDocument>): Promise<IBrandDocument> {
    return await BrandCollection.create(data);
  }

  async updateById(id: string, updates: Partial<IBrandDocument>): Promise<IBrandDocument | null> {
    return await BrandCollection.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  }

  async deleteById(id: string): Promise<IBrandDocument | null> {
    return await BrandCollection.findByIdAndDelete(id);
  }
}
