import { z } from "zod";

export const UserValidationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  ageVerified: z.boolean().refine(val => val === true, "You must confirm you are 18 or older"),
  role: z.enum(["user", "admin"]).default("user"),
  isActive: z.boolean().default(true),
  bio: z.string().max(300, "Bio must be 300 characters or fewer").optional()
});

export type UserDataType = z.infer<typeof UserValidationSchema>;
