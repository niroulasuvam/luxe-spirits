import { describe, expect, jest, test } from "@jest/globals";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import { ResponseFormatter } from "../utils/apihelper.util";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middlewares/auth.middleware";
import { JWT_SECRET } from "../configs/constant";
import { RegisterUserDTO, LoginUserDTO, UpdateProfileDTO, ForgotPasswordDTO, ResetPasswordDTO, ResetPasswordOtpDTO, ChangePasswordDTO, GoogleAuthDTO, AdminUpdateUserDTO } from "../dtos/user.dto";
import { CreateProductDTO, UpdateProductDTO, ListProductsQueryDTO } from "../dtos/product.dto";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { CreateBrandDTO, UpdateBrandDTO } from "../dtos/brand.dto";
import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { CreateOrderDTO } from "../dtos/order.dto";
import { CreateCouponDTO, UpdateCouponDTO, ApplyCouponDTO } from "../dtos/coupon.dto";
import { CreateReviewDTO } from "../dtos/review.dto";
import { ToggleWishlistDTO } from "../dtos/wishlist.dto";
import { CustomHttpException } from "../exceptions/http-exception";

const validRegisterUser = {
  fullName: "Test Member",
  email: "member@example.com",
  password: "password123",
  ageVerified: true
};

const validProduct = {
  name: "Test Whisky",
  slug: "test-whisky",
  categoryId: "category-id",
  brandId: "brand-id",
  origin: "Nepal",
  age: "12 Years",
  price: 5000,
  image: "http://localhost:8089/uploads/products/test.png",
  notes: ["Oak", "Honey"],
  abv: "40%",
  description: "A test liquor"
};

function mockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return res as any;
}

function mockNext() {
  return jest.fn();
}

describe("User DTO Tests", () => {
  test("register accepts a valid member payload", () => {
    expect(RegisterUserDTO.safeParse(validRegisterUser).success).toBe(true);
  });

  test("register defaults missing role to user", () => {
    const result = RegisterUserDTO.parse(validRegisterUser);
    expect(result.role).toBe("user");
  });

  test("register accepts admin role from Postman", () => {
    const result = RegisterUserDTO.parse({ ...validRegisterUser, role: "admin" });
    expect(result.role).toBe("admin");
  });

  test("register rejects invalid email", () => {
    expect(RegisterUserDTO.safeParse({ ...validRegisterUser, email: "bad" }).success).toBe(false);
  });

  test("register rejects short password", () => {
    expect(RegisterUserDTO.safeParse({ ...validRegisterUser, password: "123" }).success).toBe(false);
  });

  test("register rejects underage confirmation", () => {
    expect(RegisterUserDTO.safeParse({ ...validRegisterUser, ageVerified: false }).success).toBe(false);
  });

  test("login accepts email and password", () => {
    expect(LoginUserDTO.safeParse({ email: "member@example.com", password: "password123" }).success).toBe(true);
  });

  test("profile update allows partial bio", () => {
    expect(UpdateProfileDTO.safeParse({ bio: "Collector of rare bottles" }).success).toBe(true);
  });

  test("forgot password requires valid email", () => {
    expect(ForgotPasswordDTO.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  test("reset password requires a long token", () => {
    expect(ResetPasswordDTO.safeParse({ token: "short", newPassword: "password123" }).success).toBe(false);
  });

  test("reset password OTP requires six digits", () => {
    expect(ResetPasswordOtpDTO.safeParse({ email: "member@example.com", otp: "123456", newPassword: "password123" }).success).toBe(true);
  });

  test("change password requires current password", () => {
    expect(ChangePasswordDTO.safeParse({ currentPassword: "", newPassword: "password123" }).success).toBe(false);
  });

  test("google auth requires a credential-like string", () => {
    expect(GoogleAuthDTO.safeParse({ credential: "tiny" }).success).toBe(false);
  });

  test("admin update accepts role changes", () => {
    expect(AdminUpdateUserDTO.safeParse({ role: "admin" }).success).toBe(true);
  });
});

describe("Product DTO Tests", () => {
  test("product accepts a complete payload", () => {
    expect(CreateProductDTO.safeParse(validProduct).success).toBe(true);
  });

  test("product coerces string price to number", () => {
    const result = CreateProductDTO.parse({ ...validProduct, price: "7500" });
    expect(result.price).toBe(7500);
  });

  test("product rejects zero price", () => {
    expect(CreateProductDTO.safeParse({ ...validProduct, price: 0 }).success).toBe(false);
  });

  test("product turns blank oldPrice into undefined", () => {
    const result = CreateProductDTO.parse({ ...validProduct, oldPrice: "" });
    expect(result.oldPrice).toBeUndefined();
  });

  test("product accepts discount oldPrice", () => {
    const result = CreateProductDTO.parse({ ...validProduct, oldPrice: "9000" });
    expect(result.oldPrice).toBe(9000);
  });

  test("product normalizes string note to array", () => {
    const result = CreateProductDTO.parse({ ...validProduct, notes: "Smoke" });
    expect(result.notes).toEqual(["Smoke"]);
  });

  test("product requires image", () => {
    expect(CreateProductDTO.safeParse({ ...validProduct, image: "" }).success).toBe(false);
  });

  test("product update allows partial price", () => {
    expect(UpdateProductDTO.safeParse({ price: "12000" }).success).toBe(true);
  });

  test("product list query coerces max price", () => {
    const result = ListProductsQueryDTO.parse({ maxPrice: "10000" });
    expect(result.maxPrice).toBe(10000);
  });
});

describe("Category And Brand DTO Tests", () => {
  test("category create accepts valid data", () => {
    expect(CreateCategoryDTO.safeParse({ name: "Rum", slug: "rum" }).success).toBe(true);
  });

  test("category rejects short name", () => {
    expect(CreateCategoryDTO.safeParse({ name: "R", slug: "rum" }).success).toBe(false);
  });

  test("category update allows partial description", () => {
    expect(UpdateCategoryDTO.safeParse({ description: "Aged rum" }).success).toBe(true);
  });

  test("brand create accepts optional origin", () => {
    expect(CreateBrandDTO.safeParse({ name: "Luxe", slug: "luxe", origin: "Nepal" }).success).toBe(true);
  });

  test("brand rejects short slug", () => {
    expect(CreateBrandDTO.safeParse({ name: "Luxe", slug: "x" }).success).toBe(false);
  });

  test("brand update allows partial origin", () => {
    expect(UpdateBrandDTO.safeParse({ origin: "Scotland" }).success).toBe(true);
  });
});

describe("Cart And Order DTO Tests", () => {
  test("add cart item accepts valid quantity", () => {
    expect(AddCartItemDTO.safeParse({ productId: "product-id", quantity: 2 }).success).toBe(true);
  });

  test("add cart item defaults quantity", () => {
    const result = AddCartItemDTO.parse({ productId: "product-id" });
    expect(result.quantity).toBe(1);
  });

  test("add cart item rejects empty product", () => {
    expect(AddCartItemDTO.safeParse({ productId: "", quantity: 1 }).success).toBe(false);
  });

  test("update cart accepts zero quantity", () => {
    expect(UpdateCartItemDTO.safeParse({ quantity: 0 }).success).toBe(true);
  });

  test("update cart rejects negative quantity", () => {
    expect(UpdateCartItemDTO.safeParse({ quantity: -1 }).success).toBe(false);
  });

  test("order accepts esewa payment", () => {
    expect(CreateOrderDTO.safeParse({
      paymentMethod: "esewa",
      billingName: "Test User",
      paymentReference: "TXN123",
      streetAddress: "Kathmandu road",
      city: "Kathmandu",
      zipCode: "44600"
    }).success).toBe(true);
  });

  test("order rejects invalid payment method", () => {
    expect(CreateOrderDTO.safeParse({
      paymentMethod: "cash",
      billingName: "Test User",
      paymentReference: "TXN123",
      streetAddress: "Kathmandu road",
      city: "Kathmandu",
      zipCode: "44600"
    }).success).toBe(false);
  });

  test("order accepts optional coordinates", () => {
    const result = CreateOrderDTO.parse({
      paymentMethod: "mobile-banking",
      billingName: "Test User",
      paymentReference: "9800000000",
      streetAddress: "Kathmandu road",
      city: "Kathmandu",
      zipCode: "44600",
      locationCoordinates: "27.7,85.3"
    });
    expect(result.locationCoordinates).toBe("27.7,85.3");
  });
});

describe("Coupon Review Wishlist DTO Tests", () => {
  test("coupon create uppercases code", () => {
    const result = CreateCouponDTO.parse({ code: "save10", discountType: "percentage", discountValue: 10 });
    expect(result.code).toBe("SAVE10");
  });

  test("coupon create defaults active", () => {
    const result = CreateCouponDTO.parse({ code: "SAVE10", discountType: "fixed", discountValue: 500 });
    expect(result.isActive).toBe(true);
  });

  test("coupon rejects invalid discount type", () => {
    expect(CreateCouponDTO.safeParse({ code: "SAVE10", discountType: "bogus", discountValue: 10 }).success).toBe(false);
  });

  test("coupon update allows partial active flag", () => {
    expect(UpdateCouponDTO.safeParse({ isActive: false }).success).toBe(true);
  });

  test("apply coupon requires positive subtotal", () => {
    expect(ApplyCouponDTO.safeParse({ code: "SAVE10", subtotal: 0 }).success).toBe(false);
  });

  test("review accepts rating from one to five", () => {
    expect(CreateReviewDTO.safeParse({ productId: "product-id", rating: 5, comment: "Great" }).success).toBe(true);
  });

  test("review rejects rating above five", () => {
    expect(CreateReviewDTO.safeParse({ productId: "product-id", rating: 6 }).success).toBe(false);
  });

  test("wishlist toggle requires product id", () => {
    expect(ToggleWishlistDTO.safeParse({ productId: "" }).success).toBe(false);
  });
});

describe("Authentication Middleware Tests", () => {
  test("authenticate rejects missing header", () => {
    expect(() => authenticate({ headers: {} } as AuthenticatedRequest, {} as any, mockNext())).toThrow(CustomHttpException);
  });

  test("authenticate rejects malformed authorization scheme", () => {
    expect(() => authenticate({ headers: { authorization: "Token abc" } } as AuthenticatedRequest, {} as any, mockNext())).toThrow("Authentication required");
  });

  test("authenticate rejects invalid token", () => {
    expect(() => authenticate({ headers: { authorization: "Bearer broken" } } as AuthenticatedRequest, {} as any, mockNext())).toThrow("Invalid or expired token");
  });

  test("authenticate attaches user id and role", () => {
    const token = jwt.sign({ id: "user-id", role: "admin" }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthenticatedRequest;
    const next = mockNext();
    authenticate(req, {} as any, next);
    expect(req.userId).toBe("user-id");
    expect(req.userRole).toBe("admin");
    expect(next).toHaveBeenCalled();
  });

  test("authenticate defaults missing role to user", () => {
    const token = jwt.sign({ id: "user-id" }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthenticatedRequest;
    authenticate(req, {} as any, mockNext());
    expect(req.userRole).toBe("user");
  });

  test("require admin accepts admin role", () => {
    const next = mockNext();
    requireAdmin({ userRole: "admin" } as AuthenticatedRequest, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  test("require admin rejects user role", () => {
    expect(() => requireAdmin({ userRole: "user" } as AuthenticatedRequest, {} as any, mockNext())).toThrow("Admin access required");
  });

  test("custom http exception stores status", () => {
    const error = new CustomHttpException(403, "Forbidden");
    expect(error.status).toBe(403);
    expect(error.name).toBe("CustomHttpException");
  });
});

describe("Response And App Contract Tests", () => {
  test("success response writes status and JSON body", () => {
    const res = mockResponse();
    ResponseFormatter.successResponse(res, { ok: true }, "Done", 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: 201, success: true, message: "Done", data: { ok: true } });
  });

  test("error response writes status and null data", () => {
    const res = mockResponse();
    ResponseFormatter.errorResponse(res, "Bad request", 400);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: 400, success: false, message: "Bad request", data: null });
  });

  test("unknown route returns 404 message", async () => {
    const res = await request(app).get("/missing-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Endpoint not found");
  });

  test("protected cart route requires authentication", async () => {
    const res = await request(app).get("/api/v1/cart");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("protected admin route requires authentication", async () => {
    const res = await request(app).get("/api/v1/admin/users");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });

  test("public product list route is registered", async () => {
    const res = await request(app).get("/api/v1/products?maxPrice=invalid");
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
