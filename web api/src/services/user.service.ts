import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepositoryMongo } from "../repositories/user.repository";
import { AdminUpdateUserDTO, ChangePasswordDTO, RegisterUserDTO, LoginUserDTO, UpdateProfileDTO } from "../dtos/user.dto";
import { CustomHttpException } from "../exceptions/http-exception";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, CLIENT_URL, GOOGLE_CLIENT_ID, JWT_SECRET } from "../configs/constant";
import { IUserDocument } from "../models/user.model";
import { sendPasswordResetEmail, sendPasswordResetOtpEmail } from "../utils/mailer.util";
import { NotificationRepositoryMongo } from "../repositories/notification.repository";

const userRepoInstance = new UserRepositoryMongo();
const notificationRepoInstance = new NotificationRepositoryMongo();

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: "true" | "false" | boolean;
  name?: string;
  picture?: string;
};

function toSafeUser(user: IUserDocument) {
  const plain = user.toObject ? user.toObject() : user;
  const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = plain as Record<string, unknown>;
  return safeUser;
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAuthToken(user: IUserDocument) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role || "user" }, JWT_SECRET, { expiresIn: "30d" });
}

export class UserService {
  async registerNewUser(userData: RegisterUserDTO) {
    const existingUser = await userRepoInstance.findByEmail(userData.email);
    if (existingUser) {
      throw new CustomHttpException(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const created = await userRepoInstance.create({ ...userData, password: hashedPassword });

    return toSafeUser(created);
  }

  async authenticateUser(loginData: LoginUserDTO) {
    let user = await userRepoInstance.findByEmailWithPassword(loginData.email);
    if (!user) {
      if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await userRepoInstance.create({
          fullName: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          ageVerified: true,
          role: "admin",
          isActive: true
        });
        user = await userRepoInstance.findByEmailWithPassword(loginData.email);
      }
      if (!user) {
        throw new CustomHttpException(400, "Invalid credentials");
      }
    }
    if (user.isActive === false) {
      throw new CustomHttpException(403, "Account is disabled");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new CustomHttpException(400, "Invalid credentials");
    }

    const token = signAuthToken(user);

    return { user: toSafeUser(user), token };
  }

  private async verifyGoogleCredential(credential: string) {
    if (!GOOGLE_CLIENT_ID) {
      throw new CustomHttpException(500, "Google login is not configured");
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!response.ok) {
      throw new CustomHttpException(400, "Invalid Google account");
    }

    const data = await response.json() as GoogleTokenInfo;
    if (data.aud !== GOOGLE_CLIENT_ID || !data.email || data.email_verified !== "true") {
      throw new CustomHttpException(400, "Google account could not be verified");
    }

    return {
      email: data.email.toLowerCase(),
      fullName: data.name || data.email.split("@")[0],
      profilePicture: data.picture
    };
  }

  async authenticateWithGoogle(credential: string) {
    const googleUser = await this.verifyGoogleCredential(credential);
    let user = await userRepoInstance.findByEmailWithPassword(googleUser.email);

    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      await userRepoInstance.create({
        fullName: googleUser.fullName,
        email: googleUser.email,
        password: hashedPassword,
        ageVerified: true,
        role: "user",
        isActive: true,
        profilePicture: googleUser.profilePicture
      });
      user = await userRepoInstance.findByEmailWithPassword(googleUser.email);
    }

    if (!user) {
      throw new CustomHttpException(400, "Google login failed");
    }
    if (user.isActive === false) {
      throw new CustomHttpException(403, "Account is disabled");
    }

    const updates: Partial<IUserDocument> = {};
    if (!user.profilePicture && googleUser.profilePicture) updates.profilePicture = googleUser.profilePicture;
    if (!user.fullName && googleUser.fullName) updates.fullName = googleUser.fullName;
    if (Object.keys(updates).length > 0) {
      const updated = await userRepoInstance.updateById(user._id.toString(), updates);
      if (updated) user = updated as IUserDocument;
    }

    return { user: toSafeUser(user), token: signAuthToken(user) };
  }

  async getProfile(userId: string) {
    const user = await userRepoInstance.findById(userId);
    if (!user) {
      throw new CustomHttpException(404, "User not found");
    }
    return toSafeUser(user);
  }

  async updateProfile(userId: string, updates: UpdateProfileDTO, profilePicture?: string) {
    const payload: Partial<IUserDocument> = { ...updates };
    if (profilePicture) {
      payload.profilePicture = profilePicture;
    }

    const updated = await userRepoInstance.updateById(userId, payload);
    if (!updated) {
      throw new CustomHttpException(404, "User not found");
    }
    return toSafeUser(updated);
  }

  async requestPasswordReset(email: string, clientResetUrlBase: string) {
    const user = await userRepoInstance.findByEmail(email);
    if (!user) {
      return;
    }

    const rawToken = crypto.randomInt(100000, 999999).toString();
    await userRepoInstance.updateById(user._id.toString(), {
      resetPasswordToken: hashToken(rawToken),
      resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS)
    });

    try {
      await sendPasswordResetOtpEmail(email, rawToken);
    } catch (error: any) {
      console.error("Failed to send password reset email:", error);
      if (error?.code === "EAUTH" || error?.responseCode === 535) {
        throw new CustomHttpException(500, "Gmail rejected EMAIL_USER or EMAIL_PASS. Use a fresh Gmail App Password.");
      }
      throw new CustomHttpException(500, "Unable to send reset email. Please try again later.");
    }
  }

  async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    const user = await userRepoInstance.findByEmail(email);
    if (!user) {
      throw new CustomHttpException(400, "Invalid or expired OTP");
    }

    const userWithResetFields = await userRepoInstance.findByResetToken(hashToken(otp));
    if (!userWithResetFields || userWithResetFields.email !== email) {
      throw new CustomHttpException(400, "Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepoInstance.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: null as unknown as string,
      resetPasswordExpires: null as unknown as Date
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await userRepoInstance.findByResetToken(hashToken(token));
    if (!user) {
      throw new CustomHttpException(400, "Invalid or expired reset link");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepoInstance.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: null as unknown as string,
      resetPasswordExpires: null as unknown as Date
    });
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await userRepoInstance.findById(userId);
    if (!user) {
      throw new CustomHttpException(404, "User not found");
    }

    const userWithPassword = await userRepoInstance.findByEmailWithPassword(user.email);
    if (!userWithPassword) {
      throw new CustomHttpException(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, userWithPassword.password);
    if (!isPasswordValid) {
      throw new CustomHttpException(400, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await userRepoInstance.updateById(userId, { password: hashedPassword });
  }

  async listUsers() {
    const users = await userRepoInstance.findAll();
    return users.map(toSafeUser);
  }

  async adminUpdateUser(id: string, updates: AdminUpdateUserDTO) {
    const updated = await userRepoInstance.updateById(id, updates);
    if (!updated) {
      throw new CustomHttpException(404, "User not found");
    }
    return toSafeUser(updated);
  }

  async deleteUser(id: string) {
    const deleted = await userRepoInstance.deleteById(id);
    if (!deleted) {
      throw new CustomHttpException(404, "User not found");
    }
    return toSafeUser(deleted);
  }

  async adminSendPasswordRecovery(id: string) {
    const user = await userRepoInstance.findById(id);
    if (!user) {
      throw new CustomHttpException(404, "User not found");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    await userRepoInstance.updateById(id, {
      resetPasswordToken: hashToken(rawToken),
      resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS)
    });

    await notificationRepoInstance.create({
      userId: user._id,
      title: "Password recovery",
      message: "An admin sent you a secure password reset link.",
      href: `${CLIENT_URL}/reset-password/${rawToken}`,
      read: false
    });
  }
}
