import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/constant";
import { CustomHttpException } from "../exceptions/http-exception";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: "user" | "admin";
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new CustomHttpException(401, "Authentication required");
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: "user" | "admin" };
    req.userId = payload.id;
    req.userRole = payload.role || "user";
    next();
  } catch {
    throw new CustomHttpException(401, "Invalid or expired token");
  }
}

export function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    throw new CustomHttpException(403, "Admin access required");
  }
  next();
}
