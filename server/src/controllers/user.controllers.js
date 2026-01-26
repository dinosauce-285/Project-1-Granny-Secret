import { userService } from "../services/user.services.js";
import cloudinary from "../config/cloudinary.config.js";

export const userController = {
  async getMe(req, res) {
    const userId = req.user.userId;
    const isUser = await userService.getUserById(userId);
    return res.ok(isUser);
  },

  async updateProfile(req, res) {
    const userId = req.user.userId;
    let avatarUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await userService.updateProfile(userId, {
      fullName: req.body.fullName,
      username: req.body.username,
      avatarUrl,
    });

    return res.ok(updatedUser);
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

  async checkIsFollowing(req, res) {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    const isFollowing = await userService.checkIsFollowing(
      followerId,
      followingId,
    );
    return res.ok({ isFollowing });
  },

  async toggleFollow(req, res) {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    const result = await userService.toggleFollow(followerId, followingId);
    return res.ok(result);
  },

  async getFollowedUsers(req, res) {
    const userId = req.user.userId;
    const followedUsers = await userService.getFollowedUsers(userId);
    return res.ok(followedUsers);
  },
};
