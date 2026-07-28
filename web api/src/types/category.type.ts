import { z } from "zod";

export const CategoryValidationSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional()
});

export type CategoryDataType = z.infer<typeof CategoryValidationSchema>;
