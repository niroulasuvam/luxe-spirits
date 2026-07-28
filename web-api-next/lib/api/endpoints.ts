export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GOOGLE_LOGIN: "/api/v1/auth/google-login",
    ME: "/api/v1/auth/me",
    PROFILE: "/api/v1/auth/profile",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    RESET_PASSWORD_OTP: "/api/v1/auth/reset-password-otp",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
  },
  CATEGORIES: "/api/v1/categories",
  PRODUCTS: {
    LIST: "/api/v1/products",
    DETAIL: (slug: string) => `/api/v1/products/${slug}`,
  },
  CART: {
    BASE: "/api/v1/cart",
    ITEMS: "/api/v1/cart/items",
    ITEM: (productId: string) => `/api/v1/cart/items/${productId}`,
  },
  ORDERS: {
    BASE: "/api/v1/orders",
    DETAIL: (orderNumber: string) => `/api/v1/orders/${orderNumber}`,
  },
  WISHLIST: {
    BASE: "/api/v1/wishlist",
    TOGGLE: "/api/v1/wishlist/toggle",
  },
  REVIEWS: {
    LIST: (productId: string) => `/api/v1/reviews?productId=${productId}`,
    CREATE: "/api/v1/reviews",
  },
  COUPONS: {
    APPLY: "/api/v1/coupons/apply",
  },
  ADMIN: {
    USERS: "/api/v1/admin/users",
    USER: (id: string) => `/api/v1/admin/users/${id}`,
    USER_RECOVERY: (id: string) => `/api/v1/admin/users/${id}/recover-password`,
    ORDERS: "/api/v1/orders/admin/all",
    NOTIFY: "/api/v1/admin/notify",
  },
  NOTIFICATIONS: {
    BASE: "/api/v1/notifications",
    READ_ALL: "/api/v1/notifications/read-all",
  },
};
