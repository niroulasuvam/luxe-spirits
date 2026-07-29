import { controllers } from "../application/container";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { avatarUpload } from "../utils/upload.util";

const userRouter = Router();
const userControllerInstance = controllers.user;

userRouter.post("/register", userControllerInstance.registerUser.bind(userControllerInstance));
userRouter.post("/login", userControllerInstance.loginUser.bind(userControllerInstance));
userRouter.post("/google-login", userControllerInstance.googleLogin.bind(userControllerInstance));

userRouter.get("/me", authenticate, userControllerInstance.getMe.bind(userControllerInstance));
userRouter.put(
  "/profile",
  authenticate,
  avatarUpload.single("avatar"),
  userControllerInstance.updateProfile.bind(userControllerInstance)
);

userRouter.post("/forgot-password", userControllerInstance.forgotPassword.bind(userControllerInstance));
userRouter.post("/reset-password", userControllerInstance.resetPassword.bind(userControllerInstance));
userRouter.post("/reset-password-otp", userControllerInstance.resetPasswordWithOtp.bind(userControllerInstance));
userRouter.put("/change-password", authenticate, userControllerInstance.changePassword.bind(userControllerInstance));

export default userRouter;
