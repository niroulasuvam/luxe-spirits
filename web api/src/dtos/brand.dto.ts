import { z } from "zod";
import { BrandValidationSchema } from "../types/brand.type";

export const CreateBrandDTO = BrandValidationSchema;
export type CreateBrandDTO = z.infer<typeof CreateBrandDTO>;

export const UpdateBrandDTO = BrandValidationSchema.partial();
export type UpdateBrandDTO = z.infer<typeof UpdateBrandDTO>;
