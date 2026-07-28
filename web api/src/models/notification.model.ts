import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  image?: string;
  href?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
    href: { type: String },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const NotificationCollection = mongoose.model<INotificationDocument>("Notification", NotificationSchema, "notifications");
