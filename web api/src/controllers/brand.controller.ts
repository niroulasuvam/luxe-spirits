import { z } from "zod";
import { Response } from "express";
import { BrandService } from "../services/brand.service";
import { CreateBrandDTO, UpdateBrandDTO } from "../dtos/brand.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  async listBrands(req: AuthenticatedRequest, res: Response) {
    try {
      const brands = await this.brandService.listBrands();
      return ResponseFormatter.successResponse(res, brands, "Brands fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async getBrand(req: AuthenticatedRequest, res: Response) {
    try {
      const brand = await this.brandService.getBrandBySlug(req.params.slug as string);
      return ResponseFormatter.successResponse(res, brand, "Brand fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createBrand(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = CreateBrandDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const brand = await this.brandService.createBrand(validationResult.data);
      return ResponseFormatter.successResponse(res, brand, "Brand created", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateBrand(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = UpdateBrandDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const brand = await this.brandService.updateBrand(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, brand, "Brand updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteBrand(req: AuthenticatedRequest, res: Response) {
    try {
      await this.brandService.deleteBrand(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Brand deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
