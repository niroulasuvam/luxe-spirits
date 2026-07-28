import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  origin?: string;
  description?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category;
  brandId: Brand;
  origin: string;
  age: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  notes: string[];
  abv: string;
  description: string;
};

type ListResponse<T> = {
  success: boolean;
  message?: string;
  data?: T[];
};

type DetailResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type AiSearchResponse = {
  answer: string;
  filters?: { maxPrice?: number | null; category?: string | null };
  products: Product[];
};

export type ProductListParams = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const listProducts = async (params: ProductListParams = {}): Promise<ListResponse<Product>> => {
  try {
    const response = await apiClient.get<ListResponse<Product>>(API.PRODUCTS.LIST, { params });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load products"));
  }
};

export const aiSearchProducts = async (prompt: string): Promise<DetailResponse<AiSearchResponse>> => {
  try {
    const response = await apiClient.post<DetailResponse<AiSearchResponse>>("/api/v1/products/ai-search", { prompt });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "AI search failed"));
  }
};

export const getProductBySlug = async (slug: string): Promise<DetailResponse<Product>> => {
  try {
    const response = await apiClient.get<DetailResponse<Product>>(API.PRODUCTS.DETAIL(slug));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load product"));
  }
};

export const listCategories = async (): Promise<ListResponse<Category>> => {
  try {
    const response = await apiClient.get<ListResponse<Category>>(API.CATEGORIES);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load categories"));
  }
};

export const listBrands = async (): Promise<ListResponse<Brand>> => {
  try {
    const response = await apiClient.get<ListResponse<Brand>>("/api/v1/brands");
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load brands"));
  }
};
