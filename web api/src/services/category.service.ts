import { ICategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { CustomHttpException } from "../exceptions/http-exception";

export class CategoryService {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async listCategories() {
    return await this.categoryRepo.findAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      throw new CustomHttpException(404, "Category not found");
    }
    return category;
  }

  async createCategory(data: CreateCategoryDTO) {
    const existing = await this.categoryRepo.findBySlug(data.slug);
    if (existing) {
      throw new CustomHttpException(400, "A category with this slug already exists");
    }
    return await this.categoryRepo.create(data);
  }

  async updateCategory(id: string, updates: UpdateCategoryDTO) {
    const updated = await this.categoryRepo.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Category not found");
    }
    return updated;
  }

  async deleteCategory(id: string) {
    const deleted = await this.categoryRepo.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Category not found");
    }
    return deleted;
  }
}
