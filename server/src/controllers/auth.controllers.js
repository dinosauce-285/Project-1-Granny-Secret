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
};
