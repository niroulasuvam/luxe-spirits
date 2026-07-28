import { z } from "zod";
import { ReviewValidationSchema } from "../types/review.type";

export const CreateReviewDTO = ReviewValidationSchema;
export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;
