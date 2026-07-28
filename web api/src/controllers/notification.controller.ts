import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { NotificationRepositoryMongo } from "../repositories/notification.repository";
import { ResponseFormatter } from "../utils/apihelper.util";

const notificationRepoInstance = new NotificationRepositoryMongo();

export class NotificationController {
  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await notificationRepoInstance.findByUserId(req.userId!);
      return ResponseFormatter.successResponse(res, notifications, "Notifications fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response) {
    try {
      await notificationRepoInstance.markAllRead(req.userId!);
      const notifications = await notificationRepoInstance.findByUserId(req.userId!);
      return ResponseFormatter.successResponse(res, notifications, "Notifications marked as read");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async clearAll(req: AuthenticatedRequest, res: Response) {
    try {
      await notificationRepoInstance.clearAll(req.userId!);
      return ResponseFormatter.successResponse(res, [], "Notifications cleared");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
