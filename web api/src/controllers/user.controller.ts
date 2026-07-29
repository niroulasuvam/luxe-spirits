import { UserService } from "../services/user.service";
import { z } from "zod";
import { ChangePasswordDTO, GoogleAuthDTO, RegisterUserDTO, LoginUserDTO, UpdateProfileDTO, ForgotPasswordDTO, ResetPasswordDTO, ResetPasswordOtpDTO } from "../dtos/user.dto";
import { ResponseFormatter } from "../utils/apihelper.util";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CLIENT_URL } from "../configs/constant";

type UploadRequest = AuthenticatedRequest & { file?: Express.Multer.File };
const requestBaseUrl = (req: AuthenticatedRequest) => `${req.protocol}://${req.get("host")}`;

export class UserController {
  constructor(private readonly userService: UserService) {}

  async registerUser(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = RegisterUserDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      const newUser = await this.userService.registerNewUser(validationResult.data);
      return ResponseFormatter.successResponse(res, newUser, "Membership created successfully");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async loginUser(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = LoginUserDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      const authResult = await this.userService.authenticateUser(validationResult.data);
      return ResponseFormatter.successResponse(
        res,
        { user: authResult.user, token: authResult.token },
        "Access granted"
      );
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async googleLogin(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = GoogleAuthDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }

      const authResult = await this.userService.authenticateWithGoogle(validationResult.data.credential);
      return ResponseFormatter.successResponse(
        res,
        { user: authResult.user, token: authResult.token },
        "Google login successful"
      );
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await this.userService.getProfile(req.userId!);
      return ResponseFormatter.successResponse(res, user, "Profile fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateProfile(req: UploadRequest, res: Response) {
    try {
      const validationResult = UpdateProfileDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      const profilePicture = req.file ? `${requestBaseUrl(req)}/uploads/avatars/${req.file.filename}` : undefined;
      const updatedUser = await this.userService.updateProfile(req.userId!, validationResult.data, profilePicture);
      return ResponseFormatter.successResponse(res, updatedUser, "Profile updated successfully");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async forgotPassword(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ForgotPasswordDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      await this.userService.requestPasswordReset(validationResult.data.email, `${CLIENT_URL}/reset-password`);
      return ResponseFormatter.successResponse(res, null, "If that email exists, a reset link has been sent");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async resetPassword(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ResetPasswordDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      await this.userService.resetPassword(validationResult.data.token, validationResult.data.newPassword);
      return ResponseFormatter.successResponse(res, null, "Password reset successfully");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async resetPasswordWithOtp(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ResetPasswordOtpDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      await this.userService.resetPasswordWithOtp(
        validationResult.data.email,
        validationResult.data.otp,
        validationResult.data.newPassword
      );
      return ResponseFormatter.successResponse(res, null, "Password changed successfully");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = ChangePasswordDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(
          res,
          z.prettifyError(validationResult.error),
          400
        );
      }

      await this.userService.changePassword(req.userId!, validationResult.data);
      return ResponseFormatter.successResponse(res, null, "Password changed successfully");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
