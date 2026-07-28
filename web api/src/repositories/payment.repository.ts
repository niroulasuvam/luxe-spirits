import { PaymentCollection, IPaymentDocument } from "../models/payment.model";

export interface IPaymentRepository {
  create(data: Partial<IPaymentDocument>): Promise<IPaymentDocument>;
  findByOrderId(orderId: string): Promise<IPaymentDocument | null>;
}

export class PaymentRepositoryMongo implements IPaymentRepository {
  async create(data: Partial<IPaymentDocument>): Promise<IPaymentDocument> {
    return await PaymentCollection.create(data);
  }

  async findByOrderId(orderId: string): Promise<IPaymentDocument | null> {
    return await PaymentCollection.findOne({ orderId });
  }
}
