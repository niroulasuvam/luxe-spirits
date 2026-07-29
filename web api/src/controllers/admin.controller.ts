import { z } from "zod";
import { Response } from "express";
import { AdminUpdateUserDTO } from "../dtos/user.dto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { ResponseFormatter } from "../utils/apihelper.util";

type AdminNotifyRequest = AuthenticatedRequest & { file?: Express.Multer.File };
const requestBaseUrl = (req: AuthenticatedRequest) => `${req.protocol}://${req.get("host")}`;

export class AdminController {
  constructor(private readonly userService: UserService) {}

  async listUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await this.userService.listUsers();
      return ResponseFormatter.successResponse(res, users, "Users fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const validationResult = AdminUpdateUserDTO.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseFormatter.errorResponse(res, z.prettifyError(validationResult.error), 400);
      }
      const user = await this.userService.adminUpdateUser(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, user, "User updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      await this.userService.deleteUser(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "User deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async sendPasswordRecovery(req: AuthenticatedRequest, res: Response) {
    try {
      await this.userService.adminSendPasswordRecovery(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "Recovery notification sent");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async notifyUsers(req: AdminNotifyRequest, res: Response) {
    try {
      const title = String(req.body.title || "").trim();
      const message = String(req.body.message || "").trim();
      if (!title || !message) {
        return ResponseFormatter.errorResponse(res, "Title and message are required", 400);
      }

      const image = req.file ? `${requestBaseUrl(req)}/uploads/notifications/${req.file.filename}` : undefined;
      const result = await this.userService.notifyActiveCustomers(title, message, image);
      return ResponseFormatter.successResponse(res, result, "Notification sent");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
