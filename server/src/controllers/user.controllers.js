import { userService } from "../services/user.services.js";

export const userController = {
  async getMe(req, res) {
    const userId = req.user.userId;
    const isUser = await userService.getUserById(userId);
    return res.ok(isUser);
  },

  async getUserProfile(req, res) {
    const { id } = req.params;
    const userProfile = await userService.getUserProfile(id);

    if (!userProfile) {
      return res.notFound("User not found");
    }

    return res.ok(userProfile);
  },

  async getUserRecipes(req, res) {
    const { id } = req.params;
    const recipes = await userService.getUserRecipes(id);
    return res.ok(recipes);
  },
};
