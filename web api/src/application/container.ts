import { AdminController } from "../controllers/admin.controller";
import { BrandController } from "../controllers/brand.controller";
import { CartController } from "../controllers/cart.controller";
import { CategoryController } from "../controllers/category.controller";
import { CouponController } from "../controllers/coupon.controller";
import { NotificationController } from "../controllers/notification.controller";
import { OrderController } from "../controllers/order.controller";
import { PaymentController } from "../controllers/payment.controller";
import { ProductController } from "../controllers/product.controller";
import { ReviewController } from "../controllers/review.controller";
import { UserController } from "../controllers/user.controller";
import { WishlistController } from "../controllers/wishlist.controller";
import { BrandRepositoryMongo } from "../repositories/brand.repository";
import { CartRepositoryMongo } from "../repositories/cart.repository";
import { CategoryRepositoryMongo } from "../repositories/category.repository";
import { CouponRepositoryMongo } from "../repositories/coupon.repository";
import { NotificationRepositoryMongo } from "../repositories/notification.repository";
import { OrderRepositoryMongo } from "../repositories/order.repository";
import { PaymentRepositoryMongo } from "../repositories/payment.repository";
import { ProductRepositoryMongo } from "../repositories/product.repository";
import { ReviewRepositoryMongo } from "../repositories/review.repository";
import { UserRepositoryMongo } from "../repositories/user.repository";
import { WishlistRepositoryMongo } from "../repositories/wishlist.repository";
import { BrandService } from "../services/brand.service";
import { CartService } from "../services/cart.service";
import { CategoryService } from "../services/category.service";
import { CouponService } from "../services/coupon.service";
import { NotificationService } from "../services/notification.service";
import { OrderService } from "../services/order.service";
import { PaymentService } from "../services/payment.service";
import { ProductService } from "../services/product.service";
import { ReviewService } from "../services/review.service";
import { UserService } from "../services/user.service";
import { WishlistService } from "../services/wishlist.service";

const brandRepository = new BrandRepositoryMongo();
const cartRepository = new CartRepositoryMongo();
const categoryRepository = new CategoryRepositoryMongo();
const couponRepository = new CouponRepositoryMongo();
const notificationRepository = new NotificationRepositoryMongo();
const orderRepository = new OrderRepositoryMongo();
const paymentRepository = new PaymentRepositoryMongo();
const productRepository = new ProductRepositoryMongo();
const reviewRepository = new ReviewRepositoryMongo();
const userRepository = new UserRepositoryMongo();
const wishlistRepository = new WishlistRepositoryMongo();

export const services = {
  brand: new BrandService(brandRepository),
  cart: new CartService(cartRepository, productRepository),
  category: new CategoryService(categoryRepository),
  coupon: new CouponService(couponRepository),
  notification: new NotificationService(notificationRepository),
  order: new OrderService(orderRepository, paymentRepository, cartRepository, notificationRepository),
  payment: new PaymentService(paymentRepository, orderRepository),
  product: new ProductService(
    productRepository,
    categoryRepository,
    brandRepository,
    notificationRepository,
    userRepository
  ),
  review: new ReviewService(reviewRepository, productRepository),
  user: new UserService(userRepository, notificationRepository),
  wishlist: new WishlistService(wishlistRepository, productRepository)
};

export const controllers = {
  admin: new AdminController(services.user),
  brand: new BrandController(services.brand),
  cart: new CartController(services.cart),
  category: new CategoryController(services.category),
  coupon: new CouponController(services.coupon),
  notification: new NotificationController(services.notification),
  order: new OrderController(services.order),
  payment: new PaymentController(services.payment),
  product: new ProductController(services.product),
  review: new ReviewController(services.review),
  user: new UserController(services.user),
  wishlist: new WishlistController(services.wishlist)
};
