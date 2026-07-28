import { OrderCollection, IOrderDocument } from "../models/order.model";

export interface IOrderRepository {
  create(data: Partial<IOrderDocument>): Promise<IOrderDocument>;
  findAll(): Promise<IOrderDocument[]>;
  findByUserId(userId: string): Promise<IOrderDocument[]>;
  findByOrderNumber(orderNumber: string): Promise<IOrderDocument | null>;
  findById(id: string): Promise<IOrderDocument | null>;
  updateStatus(id: string, status: string, expectedDelivery?: Date): Promise<IOrderDocument | null>;
}

export class OrderRepositoryMongo implements IOrderRepository {
  async create(data: Partial<IOrderDocument>): Promise<IOrderDocument> {
    return await OrderCollection.create(data);
  }

  async findAll(): Promise<IOrderDocument[]> {
    return await OrderCollection.find({}).populate({ path: "userId", select: "fullName email" }).sort({ createdAt: -1 });
  }

  async findByUserId(userId: string): Promise<IOrderDocument[]> {
    return await OrderCollection.find({ userId }).sort({ createdAt: -1 });
  }

  async findByOrderNumber(orderNumber: string): Promise<IOrderDocument | null> {
    return await OrderCollection.findOne({ orderNumber });
  }

  async findById(id: string): Promise<IOrderDocument | null> {
    return await OrderCollection.findById(id);
  }

  async updateStatus(id: string, status: string, expectedDelivery?: Date): Promise<IOrderDocument | null> {
    const update: { status: string; expectedDelivery?: Date } = { status };
    if (expectedDelivery) {
      update.expectedDelivery = expectedDelivery;
    }
    return await OrderCollection.findByIdAndUpdate(id, update, { returnDocument: "after" });
  }
}
