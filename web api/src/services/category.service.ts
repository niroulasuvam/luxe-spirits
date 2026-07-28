import { CategoryRepositoryMongo } from "../repositories/category.repository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { CustomHttpException } from "../exceptions/http-exception";

const categoryRepoInstance = new CategoryRepositoryMongo();

export class CategoryService {
  async listCategories() {
    return await categoryRepoInstance.findAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepoInstance.findBySlug(slug);
    if (!category) {
      throw new CustomHttpException(404, "Category not found");
    }
    return category;
  }

  async createCategory(data: CreateCategoryDTO) {
    const existing = await categoryRepoInstance.findBySlug(data.slug);
    if (existing) {
      throw new CustomHttpException(400, "A category with this slug already exists");
    }
    return await categoryRepoInstance.create(data);
  }

  async updateCategory(id: string, updates: UpdateCategoryDTO) {
    const updated = await categoryRepoInstance.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Category not found");
    }
    return updated;
  }

  async deleteCategory(id: string) {
    const deleted = await categoryRepoInstance.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Category not found");
    }
    return deleted;
  }
}
