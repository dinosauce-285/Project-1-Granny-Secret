import { authService } from "../services/auth.services.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

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

      const user = await authService.updateProfile(userId, {
        fullName,
        avatarUrl,
      });
      return res.ok(user, "Profile updated successfully");
    } catch (error) {
      return res.error("Failed to update profile", [], 500);
    }
  },

  async googleLogin(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.error("Token is required", [], 400);
      }

      const data = await authService.loginWithGoogle(token);

      return res.ok(data, "Google login successful");
    } catch (error) {
      console.error("Google login error:", error);
      if (error.message === "Invalid Google token") {
        return res.error("Invalid Google token", [], 401);
      }
      return res.error(error.message || "Google login failed", [], 500);
    }
  },
};
