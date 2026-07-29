import { IBrandRepository } from "../repositories/brand.repository";
import { CreateBrandDTO, UpdateBrandDTO } from "../dtos/brand.dto";
import { CustomHttpException } from "../exceptions/http-exception";

export class BrandService {
  constructor(private readonly brandRepo: IBrandRepository) {}

  async listBrands() {
    return await this.brandRepo.findAll();
  }

  async getBrandBySlug(slug: string) {
    const brand = await this.brandRepo.findBySlug(slug);
    if (!brand) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return brand;
  }

  async createBrand(data: CreateBrandDTO) {
    const existing = await this.brandRepo.findBySlug(data.slug);
    if (existing) {
      throw new CustomHttpException(400, "A brand with this slug already exists");
    }
    return await this.brandRepo.create(data);
  }

  async updateBrand(id: string, updates: UpdateBrandDTO) {
    const updated = await this.brandRepo.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return updated;
  }

  async deleteBrand(id: string) {
    const deleted = await this.brandRepo.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "Brand not found");
    }
    return deleted;
  }
}
