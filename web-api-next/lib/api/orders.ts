import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: { streetAddress: string; city: string; zipCode: string };
  status: string;
  expectedDelivery: string;
  createdAt: string;
};

export type CreateOrderPayload = {
  paymentMethod: "esewa" | "mobile-banking";
  billingName: string;
  paymentReference: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  locationCoordinates?: string;
};

type OrderResponse = { success: boolean; message?: string; data?: Order };
type OrderListResponse = { success: boolean; message?: string; data?: Order[] };

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const listOrders = async (token: string): Promise<OrderListResponse> => {
  try {
    const response = await apiClient.get<OrderListResponse>(API.ORDERS.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load orders"));
  }
};

export const createOrder = async (token: string, payload: CreateOrderPayload): Promise<OrderResponse> => {
  try {
    const response = await apiClient.post<OrderResponse>(API.ORDERS.BASE, payload, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to place order"));
  }
};

export const getOrder = async (token: string, orderNumber: string): Promise<OrderResponse> => {
  try {
    const response = await apiClient.get<OrderResponse>(API.ORDERS.DETAIL(orderNumber), authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load order"));
  }
};
