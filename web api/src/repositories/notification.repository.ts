import { NotificationCollection, INotificationDocument } from "../models/notification.model";

export class NotificationRepositoryMongo {
  async create(data: Partial<INotificationDocument>): Promise<INotificationDocument> {
    return await NotificationCollection.create(data);
  }

  async createMany(data: Partial<INotificationDocument>[]) {
    return await NotificationCollection.insertMany(data);
  }

  async findByUserId(userId: string): Promise<INotificationDocument[]> {
    return await NotificationCollection.find({ userId }).sort({ createdAt: -1 });
  }

  async markAllRead(userId: string) {
    return await NotificationCollection.updateMany({ userId }, { $set: { read: true } });
  }

  async clearAll(userId: string) {
    return await NotificationCollection.deleteMany({ userId });
  }
}
