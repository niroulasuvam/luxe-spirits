import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../configs/constant";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER/EMAIL_PASS not configured; skipping password reset email send.");
    return;
  }

  await transporter.sendMail({
    from: `"Liquor Hub" <${EMAIL_USER}>`,
    to,
    subject: "Reset your Liquor Hub password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #806505;">Reset your password</h2>
        <p>We received a request to reset your Liquor Hub password. This link expires in 15 minutes.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#d8b52f;color:#3c3106;text-decoration:none;border-radius:8px;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  });
}

export async function sendPasswordResetOtpEmail(to: string, otp: string) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER/EMAIL_PASS not configured; skipping password reset OTP email send.");
    return;
  }

  await transporter.sendMail({
    from: `"Liquor Hub" <${EMAIL_USER}>`,
    to,
    subject: "Your Liquor Hub password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #806505;">Reset your password</h2>
        <p>Use this OTP to reset your Liquor Hub password. It expires in 15 minutes.</p>
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #111827;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  });
}
