import { z } from "zod";
import { Response } from "express";
import { ProductService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO, ListProductsQueryDTO } from "../dtos/product.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

type ProductUploadRequest = AuthenticatedRequest & { file?: Express.Multer.File };

const requestBaseUrl = (req: AuthenticatedRequest) => `${req.protocol}://${req.get("host")}`;

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async listProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ListProductsQueryDTO.safeParse(req.query);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const products = await this.productService.listProducts(validationResult.data);
      return ResponseFormatter.successResponse(res, products, "Products fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async aiSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const prompt = String(req.body.prompt || "");
      const result = await this.productService.aiSearch(prompt);
      return ResponseFormatter.successResponse(res, result, "AI search completed");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async getProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await this.productService.getProductBySlug(req.params.slug as string);
      return ResponseFormatter.successResponse(res, product, "Product fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async createProduct(req: ProductUploadRequest, res: Response) {
    try {
      const image = req.file ? `${requestBaseUrl(req)}/uploads/products/${req.file.filename}` : req.body.image;
      const validationResult = CreateProductDTO.safeParse({ ...req.body, image });
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const product = await this.productService.createProduct(validationResult.data);
      return ResponseFormatter.successResponse(res, product, "Product created", 201);
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateProduct(req: ProductUploadRequest, res: Response) {
    try {
      const image = req.file ? `${requestBaseUrl(req)}/uploads/products/${req.file.filename}` : req.body.image;
      const validationResult = UpdateProductDTO.safeParse({ ...req.body, image });
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const product = await this.productService.updateProduct(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, product, "Product updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      await this.productService.deleteProduct(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Product deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
