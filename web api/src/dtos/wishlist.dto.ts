import { z } from "zod";

export const ToggleWishlistDTO = z.object({
  productId: z.string().min(1, "productId is required")
});

export type ToggleWishlistDTO = z.infer<typeof ToggleWishlistDTO>;
