import { authService } from "../services/auth.services.js";
import { registerSchema } from "../schemas/auth.schema.js";

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
};
