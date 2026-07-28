import { z } from "zod";

export const ReviewValidationSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().optional()
});

export type ReviewDataType = z.infer<typeof ReviewValidationSchema>;
