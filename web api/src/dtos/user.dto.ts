import { z } from "zod";
import { UserValidationSchema } from "../types/user.type";

export const RegisterUserDTO = UserValidationSchema.pick({
  fullName: true,
  email: true,
  password: true,
  ageVerified: true,
  role: true
});

export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

export const LoginUserDTO = UserValidationSchema.pick({
  email: true,
  password: true
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateProfileDTO = UserValidationSchema.pick({
  fullName: true,
  bio: true
}).partial();

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTO>;

export const ForgotPasswordDTO = UserValidationSchema.pick({
  email: true
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;

export const ResetPasswordDTO = z.object({
  token: z.string().min(10, "Invalid reset token"),
  newPassword: UserValidationSchema.shape.password
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;

export const ResetPasswordOtpDTO = z.object({
  email: UserValidationSchema.shape.email,
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  newPassword: UserValidationSchema.shape.password
});

export type ResetPasswordOtpDTO = z.infer<typeof ResetPasswordOtpDTO>;

export const ChangePasswordDTO = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: UserValidationSchema.shape.password
});

export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTO>;

export const GoogleAuthDTO = z.object({
  credential: z.string().min(20, "Google credential is required")
});

export type GoogleAuthDTO = z.infer<typeof GoogleAuthDTO>;

export const AdminUpdateUserDTO = UserValidationSchema.pick({
  fullName: true,
  role: true,
  isActive: true
}).partial();

export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;
