import { UserCollection, IUserDocument } from "../models/user.model";

export interface IUserRepository {
  findAll(): Promise<IUserDocument[]>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
  create(userData: Partial<IUserDocument>): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  updateById(id: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null>;
  findByResetToken(hashedToken: string): Promise<IUserDocument | null>;
  findByIdWithResetFields(id: string): Promise<IUserDocument | null>;
  deleteById(id: string): Promise<IUserDocument | null>;
}

export class UserRepositoryMongo implements IUserRepository {
  async findAll(): Promise<IUserDocument[]> {
    return await UserCollection.find({}).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return await UserCollection.findOne({ _id: id });
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await UserCollection.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return await UserCollection.findOne({ email }).select("+password");
  }

  async create(userData: Partial<IUserDocument>): Promise<IUserDocument> {
    return await UserCollection.create(userData);
  }

  async updateById(id: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return await UserCollection.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  }

  async findByResetToken(hashedToken: string): Promise<IUserDocument | null> {
    return await UserCollection.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    }).select("+resetPasswordToken +resetPasswordExpires");
  }

  async findByIdWithResetFields(id: string): Promise<IUserDocument | null> {
    return await UserCollection.findById(id).select("+resetPasswordToken +resetPasswordExpires");
  }

  async deleteById(id: string): Promise<IUserDocument | null> {
    return await UserCollection.findByIdAndDelete(id);
  }
}
