import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT: number = Number(process.env.PORT) || 8089;
export const DATABASE_URL: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/luxe-spirits-db";
export const JWT_SECRET: string =
  process.env.SECRET_KEY || "liquorhub_secret_2026";
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";
export const SERVER_URL: string = process.env.SERVER_URL || `http://localhost:${Number(process.env.PORT) || 8089}`;
export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const EMAIL_PASS: string = process.env.EMAIL_PASS || "";
export const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL || "admin@example.com";
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || "admin123";
export const ADMIN_NAME: string = process.env.ADMIN_NAME || "Liquor Hub Admin";
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";
export const GEMINI_MODEL: string = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
