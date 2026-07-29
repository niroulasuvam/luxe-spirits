import { INotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async listForUser(userId: string) {
    return await this.notificationRepo.findByUserId(userId);
  }

  async markAllRead(userId: string) {
    await this.notificationRepo.markAllRead(userId);
    return await this.notificationRepo.findByUserId(userId);
  }

  async clearAll(userId: string) {
    await this.notificationRepo.clearAll(userId);
    return [];
  }
}
