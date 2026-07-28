import { z } from "zod";
import { CategoryValidationSchema } from "../types/category.type";

export const CreateCategoryDTO = CategoryValidationSchema;
export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTO>;

export const UpdateCategoryDTO = CategoryValidationSchema.partial();
export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTO>;
