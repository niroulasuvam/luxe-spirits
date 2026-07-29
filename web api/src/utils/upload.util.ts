import crypto from "crypto";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const AVATAR_DIR = path.join(UPLOADS_ROOT, "avatars");
const PRODUCT_DIR = path.join(UPLOADS_ROOT, "products");
const NOTIFICATION_DIR = path.join(UPLOADS_ROOT, "notifications");

fs.mkdirSync(AVATAR_DIR, { recursive: true });
fs.mkdirSync(PRODUCT_DIR, { recursive: true });
fs.mkdirSync(NOTIFICATION_DIR, { recursive: true });

const createStorage = (destination: string) => multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, destination),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname) {
    // No file was actually selected (e.g. an empty <input type="file"> submitted alongside other
    // form fields) - skip it silently instead of rejecting the whole request.
    cb(null, false);
    return;
  }
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};

export const avatarUpload = multer({
  storage: createStorage(AVATAR_DIR),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const productImageUpload = multer({
  storage: createStorage(PRODUCT_DIR),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const notificationImageUpload = multer({
  storage: createStorage(NOTIFICATION_DIR),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
