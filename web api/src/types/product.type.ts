import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => value === "" ? undefined : value;
const stringOrArrayToArray = (value: unknown) => Array.isArray(value) ? value : value ? [String(value)] : [];

export const ProductValidationSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  origin: z.string().min(1, "Origin is required"),
  age: z.string().min(1, "Age is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  oldPrice: z.preprocess(emptyStringToUndefined, z.coerce.number().positive().optional()),
  badge: z.preprocess(emptyStringToUndefined, z.string().optional()),
  image: z.string().min(1, "Image is required"),
  notes: z.preprocess(stringOrArrayToArray, z.array(z.string()).default([])),
  abv: z.string().min(1, "ABV is required"),
  description: z.string().min(1, "Description is required")
});

export type ProductDataType = z.infer<typeof ProductValidationSchema>;
