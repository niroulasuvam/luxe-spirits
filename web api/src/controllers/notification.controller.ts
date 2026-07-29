import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { NotificationService } from "../services/notification.service";
import { ResponseFormatter } from "../utils/apihelper.util";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await this.notificationService.listForUser(req.userId!);
      return ResponseFormatter.successResponse(res, notifications, "Notifications fetched");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await this.notificationService.markAllRead(req.userId!);
      return ResponseFormatter.successResponse(res, notifications, "Notifications marked as read");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }

  async clearAll(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await this.notificationService.clearAll(req.userId!);
      return ResponseFormatter.successResponse(res, notifications, "Notifications cleared");
    } catch (error: any) {
      return ResponseFormatter.errorResponse(res, error.message, error.status || 500);
    }
  }
}
