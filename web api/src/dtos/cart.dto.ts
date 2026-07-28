import { z } from "zod";

export const AddCartItemDTO = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().int().positive().default(1)
});

export type AddCartItemDTO = z.infer<typeof AddCartItemDTO>;

export const UpdateCartItemDTO = z.object({
  quantity: z.number().int().min(0, "quantity must be 0 or greater")
});

export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemDTO>;
