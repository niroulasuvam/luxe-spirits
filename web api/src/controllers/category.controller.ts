import { z } from "zod";
import { Response } from "express";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const categoryServiceInstance = new CategoryService();

export class CategoryController {
  async listCategories(req: AuthenticatedRequest, res: Response) {
    try {
      const categories = await categoryServiceInstance.listCategories();
      return ResponseFormatter.successResponse(res, categories, "Categories fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async getCategory(req: AuthenticatedRequest, res: Response) {
    try {
      const category = await categoryServiceInstance.getCategoryBySlug(req.params.slug as string);
      return ResponseFormatter.successResponse(res, category, "Category fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createCategory(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = CreateCategoryDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const category = await categoryServiceInstance.createCategory(validationResult.data);
      return ResponseFormatter.successResponse(res, category, "Category created", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateCategory(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = UpdateCategoryDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const category = await categoryServiceInstance.updateCategory(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, category, "Category updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteCategory(req: AuthenticatedRequest, res: Response) {
    try {
      await categoryServiceInstance.deleteCategory(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Category deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
