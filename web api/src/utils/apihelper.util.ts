import { Response } from "express";

export interface APIResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export class ResponseFormatter {
  static successResponse<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: APIResponse<T> = {
      status: statusCode,
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  static errorResponse(
    res: Response,
    message: string = "Error occurred",
    statusCode: number = 500
  ): Response {
    const response: APIResponse<null> = {
      status: statusCode,
      success: false,
      message,
      data: null
    };
    return res.status(statusCode).json(response);
  }
}