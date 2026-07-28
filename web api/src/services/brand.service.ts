import { BrandRepositoryMongo } from "../repositories/brand.repository";
import { CreateBrandDTO, UpdateBrandDTO } from "../dtos/brand.dto";
import { CustomHttpException } from "../exceptions/http-exception";

const brandRepoInstance = new BrandRepositoryMongo();

export class BrandService {
  async listBrands() {
    return await brandRepoInstance.findAll();
  }

  async getBrandBySlug(slug: string) {
    const brand = await brandRepoInstance.findBySlug(slug);
    if (!brand) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return brand;
  }

  async createBrand(data: CreateBrandDTO) {
    const existing = await brandRepoInstance.findBySlug(data.slug);
    if (existing) {
      throw new CustomHttpException(400, "A brand with this slug already exists");
    }
    return await brandRepoInstance.create(data);
  }

  async updateBrand(id: string, updates: UpdateBrandDTO) {
    const updated = await brandRepoInstance.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return updated;
  }

  async deleteBrand(id: string) {
    const deleted = await brandRepoInstance.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return deleted;
  }
}
