import { z } from "zod";

export const BrandValidationSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  origin: z.string().optional(),
  description: z.string().optional()
});

export type BrandDataType = z.infer<typeof BrandValidationSchema>;
