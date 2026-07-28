import mongoose from "mongoose";
import { DATABASE_URL } from "../configs/constant";
import { ensureDefaultCategories } from "./defaults";

export const initializeDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    await ensureDefaultCategories();
    console.log("✅ Connected to Luxe Spirits Database");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};
