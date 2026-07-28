import { ProductCollection, IProductDocument } from "../models/product.model";

export type ProductFilter = {
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductWriteInput = Partial<Omit<IProductDocument, "categoryId" | "brandId">> & {
  categoryId?: string;
  brandId?: string;
};

const POPULATE_FIELDS = [
  { path: "categoryId", select: "name slug" },
  { path: "brandId", select: "name slug origin" }
];

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface IProductRepository {
  findAll(filter: ProductFilter): Promise<IProductDocument[]>;
  findById(id: string): Promise<IProductDocument | null>;
  findBySlug(slug: string): Promise<IProductDocument | null>;
  findByIds(ids: string[]): Promise<IProductDocument[]>;
  create(data: ProductWriteInput): Promise<IProductDocument>;
  updateById(id: string, updates: ProductWriteInput): Promise<IProductDocument | null>;
  deleteById(id: string): Promise<IProductDocument | null>;
}

export class ProductRepositoryMongo implements IProductRepository {
  async findAll(filter: ProductFilter): Promise<IProductDocument[]> {
    const query: Record<string, unknown> = {};
    if (filter.categoryId) query.categoryId = filter.categoryId;
    if (filter.brandId) query.brandId = filter.brandId;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (filter.minPrice !== undefined) priceFilter.$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) priceFilter.$lte = filter.maxPrice;
      query.price = priceFilter;
    }
    if (filter.search) {
      query.name = { $regex: `^${escapeRegex(filter.search.trim())}`, $options: "i" };
    }

    return await ProductCollection.find(query).populate(POPULATE_FIELDS).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProductDocument | null> {
    return await ProductCollection.findById(id).populate(POPULATE_FIELDS);
  }

  async findBySlug(slug: string): Promise<IProductDocument | null> {
    return await ProductCollection.findOne({ slug }).populate(POPULATE_FIELDS);
  }

  async findByIds(ids: string[]): Promise<IProductDocument[]> {
    return await ProductCollection.find({ _id: { $in: ids } }).populate(POPULATE_FIELDS);
  }

  async create(data: ProductWriteInput): Promise<IProductDocument> {
    return await ProductCollection.create(data);
  }

  async updateById(id: string, updates: ProductWriteInput): Promise<IProductDocument | null> {
    return await ProductCollection.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  }

  async deleteById(id: string): Promise<IProductDocument | null> {
    return await ProductCollection.findByIdAndDelete(id);
  }
}
