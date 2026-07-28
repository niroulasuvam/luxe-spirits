import { z } from "zod";
import { ProductValidationSchema } from "../types/product.type";

export const CreateProductDTO = ProductValidationSchema;
export type CreateProductDTO = z.infer<typeof CreateProductDTO>;

export const UpdateProductDTO = ProductValidationSchema.partial();
export type UpdateProductDTO = z.infer<typeof UpdateProductDTO>;

export const ListProductsQueryDTO = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

export type ListProductsQueryDTO = z.infer<typeof ListProductsQueryDTO>;
