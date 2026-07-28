import { z } from "zod";
import { Response } from "express";
import { AdminUpdateUserDTO } from "../dtos/user.dto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { UserRepositoryMongo } from "../repositories/user.repository";
import { NotificationRepositoryMongo } from "../repositories/notification.repository";
import { ResponseFormatter } from "../utils/apihelper.util";

const userServiceInstance = new UserService();
const userRepoInstance = new UserRepositoryMongo();
const notificationRepoInstance = new NotificationRepositoryMongo();
type AdminNotifyRequest = AuthenticatedRequest & { file?: Express.Multer.File };
const requestBaseUrl = (req: AuthenticatedRequest) => `${req.protocol}://${req.get("host")}`;

export class AdminController {
  async listUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await userServiceInstance.listUsers();
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
      const user = await userServiceInstance.adminUpdateUser(req.params.id as string, validationResult.data);
      return ResponseFormatter.successResponse(res, user, "User updated");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      await userServiceInstance.deleteUser(req.params.id as string);
      return ResponseFormatter.successResponse(res, null, "User deleted");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async sendPasswordRecovery(req: AuthenticatedRequest, res: Response) {
    try {
      await userServiceInstance.adminSendPasswordRecovery(req.params.id as string);
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
      const users = await userRepoInstance.findAll();
      const activeCustomers = users.filter((user) => user.role === "user" && user.isActive);

      if (activeCustomers.length > 0) {
        await notificationRepoInstance.createMany(
          activeCustomers.map((user) => ({
            userId: user._id,
            title,
            message,
            image
          } as any))
        );
      }

      return ResponseFormatter.successResponse(res, { sent: activeCustomers.length }, "Notification sent");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
