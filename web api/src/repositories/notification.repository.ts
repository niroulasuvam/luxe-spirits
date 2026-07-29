import { NotificationCollection, INotificationDocument } from "../models/notification.model";

export interface INotificationRepository {
  create(data: Partial<INotificationDocument>): Promise<INotificationDocument>;
  createMany(data: Partial<INotificationDocument>[]): Promise<unknown>;
  findByUserId(userId: string): Promise<INotificationDocument[]>;
  markAllRead(userId: string): Promise<unknown>;
  clearAll(userId: string): Promise<unknown>;
}

export class NotificationRepositoryMongo implements INotificationRepository {
  async create(data: Partial<INotificationDocument>): Promise<INotificationDocument> {
    return await NotificationCollection.create(data);
  }

  async createMany(data: Partial<INotificationDocument>[]): Promise<unknown> {
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
