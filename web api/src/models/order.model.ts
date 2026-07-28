import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  streetAddress: string;
  city: string;
  zipCode: string;
}

export type OrderStatus = "pending" | "accepted" | "shipped" | "delivered" | "cancelled";

export interface IOrderDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  expectedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    expectedDelivery: { type: Date, required: true }
  },
  { timestamps: true }
);

export const OrderCollection = mongoose.model<IOrderDocument>("Order", OrderSchema, "orders");
