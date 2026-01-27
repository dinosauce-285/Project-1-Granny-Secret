import { authService } from "../services/auth.services.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import cloudinary from "../config/cloudinary.config.js";

export const authController = {
  async register(req, res) {
    try {
      const result = registerSchema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return res.error("Validation failed", errors, 400);
      }

      const { email, username, password, fullName } = result.data;

      const user = await authService.register({
        email,
        username,
        password,
        fullName,
      });

      return res.created("User registered successfully", user);
    } catch (error) {
      if (error.message === "Email already exists") {
        return res.error("Email already exists", [], 400);
      }
      if (error.message === "Username already exists") {
        return res.error("Username already exists", [], 400);
      }
      return res.error("Registration failed", [], 500);
    }
  },

  async login(req, res) {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return res.error("Validation failed", errors, 400);
      }

      const { email, password } = result.data;

      const data = await authService.login({ email, password });

      return res.ok(data, "Login successful");
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.error("Invalid email or password", [], 401);
      }
      return res.error("Login failed", [], 500);
    }
  },

  async updateProfile(req, res) {
    try {
      const { userId, fullName, avatarUrl } = req.body;

      if (!userId) {
        return res.error("User ID is required", [], 400);
      }

      let finalAvatarUrl = avatarUrl;

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "avatars",
        });
        finalAvatarUrl = uploadResult.secure_url;
      }

      const user = await authService.updateProfile(userId, {
        fullName,
        avatarUrl: finalAvatarUrl,
      });
      return res.ok(user, "Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      return res.error("Failed to update profile", [], 500);
    }
  },

  async googleLogin(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.error("Token is required", [], 400);
      }

      // Check if Supabase is properly configured
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
        console.error("Supabase configuration missing:", {
          hasUrl: !!process.env.SUPABASE_URL,
          hasKey: !!process.env.SUPABASE_KEY,
        });
        return res.error(
          "Authentication service not configured. Please contact support.",
          [],
          500,
        );
      }

      const data = await authService.loginWithGoogle(token);

      return res.ok(data, "Google login successful");
    } catch (error) {
      console.error("Google login error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      if (
        error.message?.includes("Invalid Google token") ||
        error.message?.includes("Invalid token") ||
        error.name === "AuthApiError"
      ) {
        return res.error(
          "Failed to verify Google authentication. Please try again.",
          [],
          401,
        );
      }

      if (error.message?.includes("Supabase not configured")) {
        return res.error(
          "Authentication service configuration error. Please contact support.",
          [],
          500,
        );
      }

      return res.error(
        error.message || "Google login failed. Please try again.",
        [],
        500,
      );
    }
  },

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.error("Email is required", [], 400);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.error("Invalid email format", [], 400);
      }

      await authService.requestPasswordReset(email);

      return res.ok(
        { message: "Password reset email sent successfully" },
        "If the email exists, a password reset link has been sent",
      );
    } catch (error) {
      console.error("Request password reset error:", error);

      // Don't reveal if email exists or not for security
      return res.ok(
        { message: "Password reset email sent successfully" },
        "If the email exists, a password reset link has been sent",
      );
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!token) {
        return res.error("Reset token is required", [], 400);
      }

      if (!newPassword) {
        return res.error("New password is required", [], 400);
      }

      if (newPassword.length < 6) {
        return res.error(
          "Password must be at least 6 characters long",
          [],
          400,
        );
      }

      await authService.resetPassword(token, newPassword);

      return res.ok(
        { message: "Password reset successfully" },
        "Your password has been reset. You can now login with your new password.",
      );
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.message === "Invalid or expired token") {
        return res.error(
          "Invalid or expired reset token. Please request a new password reset.",
          [],
          400,
        );
      }

      return res.error("Failed to reset password. Please try again.", [], 500);
    }
  },
};
