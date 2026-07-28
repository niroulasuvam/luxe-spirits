import { CategoryCollection, ICategoryDocument } from "../models/category.model";

export interface ICategoryRepository {
  findAll(): Promise<ICategoryDocument[]>;
  findById(id: string): Promise<ICategoryDocument | null>;
  findBySlug(slug: string): Promise<ICategoryDocument | null>;
  create(data: Partial<ICategoryDocument>): Promise<ICategoryDocument>;
  updateById(id: string, updates: Partial<ICategoryDocument>): Promise<ICategoryDocument | null>;
  deleteById(id: string): Promise<ICategoryDocument | null>;
}

export class CategoryRepositoryMongo implements ICategoryRepository {
  async findAll(): Promise<ICategoryDocument[]> {
    return await CategoryCollection.find({}).sort({ name: 1 });
  }

  async findById(id: string): Promise<ICategoryDocument | null> {
    return await CategoryCollection.findById(id);
  }

  async findBySlug(slug: string): Promise<ICategoryDocument | null> {
    return await CategoryCollection.findOne({ slug });
  }

  async create(data: Partial<ICategoryDocument>): Promise<ICategoryDocument> {
    return await CategoryCollection.create(data);
  }

  async updateById(id: string, updates: Partial<ICategoryDocument>): Promise<ICategoryDocument | null> {
    return await CategoryCollection.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  }

  async deleteById(id: string): Promise<ICategoryDocument | null> {
    return await CategoryCollection.findByIdAndDelete(id);
  }
}
